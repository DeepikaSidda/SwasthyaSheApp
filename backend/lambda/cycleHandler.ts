import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  successResponse,
  errorResponse,
  validateRequired,
  validateDateFormat,
  validateEnum,
  createUserKey,
  createCycleKey,
  getCurrentISOTimestamp,
  generateId,
} from './utils';

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = process.env.CYCLES_TABLE_NAME || 'SwasthyasheCycles';

// Valid flow intensity values
const VALID_FLOW_INTENSITIES = ['light', 'medium', 'heavy'] as const;
type FlowIntensity = (typeof VALID_FLOW_INTENSITIES)[number];

// Cycle entry interface
interface CycleEntry {
  PK: string;
  SK: string;
  userId: string;
  startDate: string;
  endDate?: string;
  flowIntensity: FlowIntensity;
  cycleLength?: number;
  createdAt: string;
  updatedAt: string;
}

// Cycle log input interface
interface CycleLogInput {
  startDate: string;
  endDate?: string;
  flowIntensity: FlowIntensity;
}

// Prediction result interface
interface CyclePrediction {
  nextPeriodStart: string;
  nextPeriodEnd: string;
  fertileWindowStart: string;
  fertileWindowEnd: string;
  ovulationDate: string;
  pmsStart: string;
  pmsEnd: string;
  averageCycleLength: number;
  averagePeriodLength: number;
  confidence: 'low' | 'medium' | 'high';
}

// Validation error interface
interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates cycle input data
 * @param input - The cycle log input to validate
 * @returns Array of validation errors, empty if valid
 */
function validateCycleInput(input: Partial<CycleLogInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate startDate is required
  if (!input.startDate) {
    errors.push({ field: 'startDate', message: 'startDate is required' });
  } else if (!validateDateFormat(input.startDate)) {
    errors.push({ field: 'startDate', message: 'startDate must be in ISO format (YYYY-MM-DD)' });
  }

  // Validate endDate if provided
  if (input.endDate !== undefined && input.endDate !== null && input.endDate !== '') {
    if (!validateDateFormat(input.endDate)) {
      errors.push({ field: 'endDate', message: 'endDate must be in ISO format (YYYY-MM-DD)' });
    } else if (input.startDate && validateDateFormat(input.startDate)) {
      // Check endDate is after startDate
      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);
      if (endDate < startDate) {
        errors.push({ field: 'endDate', message: 'endDate must be after startDate' });
      }
    }
  }

  // Validate flowIntensity
  if (!input.flowIntensity) {
    errors.push({ field: 'flowIntensity', message: 'flowIntensity is required' });
  } else if (!validateEnum(input.flowIntensity, [...VALID_FLOW_INTENSITIES])) {
    errors.push({
      field: 'flowIntensity',
      message: "flowIntensity must be one of: 'light', 'medium', 'heavy'",
    });
  }

  return errors;
}

/**
 * Gets user's cycle history from DynamoDB
 */
async function getCycles(userId: string): Promise<CycleEntry[]> {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
    ExpressionAttributeValues: {
      ':pk': createUserKey(userId),
      ':skPrefix': 'CYCLE#',
    },
    ScanIndexForward: false, // Sort by SK descending (most recent first)
  };

  const result = await docClient.send(new QueryCommand(params));
  return (result.Items || []) as CycleEntry[];
}

/**
 * Creates a new cycle entry in DynamoDB
 */
async function createCycle(userId: string, input: CycleLogInput): Promise<CycleEntry> {
  const now = getCurrentISOTimestamp();
  const pk = createUserKey(userId);
  const sk = createCycleKey(input.startDate);

  const cycleEntry: CycleEntry = {
    PK: pk,
    SK: sk,
    userId,
    startDate: input.startDate,
    flowIntensity: input.flowIntensity,
    createdAt: now,
    updatedAt: now,
  };

  if (input.endDate) {
    cycleEntry.endDate = input.endDate;
  }

  // Calculate cycle length if we have previous cycles
  const previousCycles = await getCycles(userId);
  if (previousCycles.length > 0) {
    // Find the most recent cycle before this one
    const previousCycle = previousCycles.find(
      (c) => new Date(c.startDate) < new Date(input.startDate)
    );
    if (previousCycle) {
      // Update the previous cycle with its cycle length
      const cycleLength = Math.round(
        (new Date(input.startDate).getTime() - new Date(previousCycle.startDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      await docClient.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { PK: previousCycle.PK, SK: previousCycle.SK },
          UpdateExpression: 'SET cycleLength = :cycleLength, updatedAt = :updatedAt',
          ExpressionAttributeValues: {
            ':cycleLength': cycleLength,
            ':updatedAt': now,
          },
        })
      );
    }
  }

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: cycleEntry,
    })
  );

  return cycleEntry;
}

/**
 * Updates an existing cycle entry in DynamoDB
 */
async function updateCycle(
  userId: string,
  cycleId: string,
  input: Partial<CycleLogInput>
): Promise<CycleEntry | null> {
  const pk = createUserKey(userId);
  const sk = createCycleKey(cycleId);

  // First, get the existing cycle
  const getResult = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
    })
  );

  if (!getResult.Item) {
    return null;
  }

  const existingCycle = getResult.Item as CycleEntry;
  const now = getCurrentISOTimestamp();

  // Build update expression
  const updateExpressions: string[] = ['updatedAt = :updatedAt'];
  const expressionAttributeValues: Record<string, unknown> = {
    ':updatedAt': now,
  };

  if (input.endDate !== undefined) {
    updateExpressions.push('endDate = :endDate');
    expressionAttributeValues[':endDate'] = input.endDate || null;
  }

  if (input.flowIntensity !== undefined) {
    updateExpressions.push('flowIntensity = :flowIntensity');
    expressionAttributeValues[':flowIntensity'] = input.flowIntensity;
  }

  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: sk },
      UpdateExpression: 'SET ' + updateExpressions.join(', '),
      ExpressionAttributeValues: expressionAttributeValues,
    })
  );

  return {
    ...existingCycle,
    ...input,
    updatedAt: now,
  };
}

/**
 * Calculates cycle predictions based on historical data
 * Requires at least 3 complete cycles for predictions
 */
function calculatePredictions(cycles: CycleEntry[]): CyclePrediction | null {
  // Filter cycles that have cycle length calculated (complete cycles)
  const completeCycles = cycles.filter((c) => c.cycleLength !== undefined && c.cycleLength > 0);

  // Need at least 3 complete cycles for predictions
  if (completeCycles.length < 3) {
    return null;
  }

  // Calculate average cycle length
  const cycleLengths = completeCycles.map((c) => c.cycleLength!);
  const averageCycleLength = Math.round(
    cycleLengths.reduce((sum, len) => sum + len, 0) / cycleLengths.length
  );

  // Calculate average period length (from cycles with end dates)
  const cyclesWithEndDate = cycles.filter((c) => c.endDate);
  let averagePeriodLength = 5; // Default to 5 days if no end dates
  if (cyclesWithEndDate.length > 0) {
    const periodLengths = cyclesWithEndDate.map((c) => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate!);
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    });
    averagePeriodLength = Math.round(
      periodLengths.reduce((sum, len) => sum + len, 0) / periodLengths.length
    );
  }

  // Get the most recent cycle (first in the sorted list)
  const mostRecentCycle = cycles[0];
  const lastPeriodStart = new Date(mostRecentCycle.startDate);

  // Calculate next period start date
  const nextPeriodStart = new Date(lastPeriodStart);
  nextPeriodStart.setDate(nextPeriodStart.getDate() + averageCycleLength);

  // Calculate next period end date
  const nextPeriodEnd = new Date(nextPeriodStart);
  nextPeriodEnd.setDate(nextPeriodEnd.getDate() + averagePeriodLength - 1);

  // Calculate ovulation date (~14 days before next period)
  const ovulationDate = new Date(nextPeriodStart);
  ovulationDate.setDate(ovulationDate.getDate() - 14);

  // Calculate fertile window (5 days before ovulation through ovulation day)
  const fertileWindowStart = new Date(ovulationDate);
  fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);
  const fertileWindowEnd = new Date(ovulationDate);

  // Calculate PMS days (7-14 days before predicted period)
  const pmsStart = new Date(nextPeriodStart);
  pmsStart.setDate(pmsStart.getDate() - 14);
  const pmsEnd = new Date(nextPeriodStart);
  pmsEnd.setDate(pmsEnd.getDate() - 7);

  // Calculate confidence based on cycle consistency
  const stdDev = calculateStandardDeviation(cycleLengths);
  let confidence: 'low' | 'medium' | 'high';
  if (stdDev <= 2) {
    confidence = 'high';
  } else if (stdDev <= 5) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  // Boost confidence if we have more cycles
  if (completeCycles.length >= 6 && confidence !== 'high') {
    confidence = confidence === 'low' ? 'medium' : 'high';
  }

  return {
    nextPeriodStart: formatDateToISO(nextPeriodStart),
    nextPeriodEnd: formatDateToISO(nextPeriodEnd),
    fertileWindowStart: formatDateToISO(fertileWindowStart),
    fertileWindowEnd: formatDateToISO(fertileWindowEnd),
    ovulationDate: formatDateToISO(ovulationDate),
    pmsStart: formatDateToISO(pmsStart),
    pmsEnd: formatDateToISO(pmsEnd),
    averageCycleLength,
    averagePeriodLength,
    confidence,
  };
}

/**
 * Calculates standard deviation of an array of numbers
 */
function calculateStandardDeviation(values: number[]): number {
  const n = values.length;
  if (n === 0) return 0;

  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / n;

  return Math.sqrt(avgSquaredDiff);
}

/**
 * Formats a Date object to ISO date string (YYYY-MM-DD)
 */
function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Extracts userId from the event (from query params, headers, or path)
 */
function getUserId(event: APIGatewayProxyEvent): string | null {
  // Try query string parameters first
  if (event.queryStringParameters?.userId) {
    return event.queryStringParameters.userId;
  }

  // Try headers (e.g., from Cognito authorizer)
  if (event.requestContext?.authorizer?.claims?.sub) {
    return event.requestContext.authorizer.claims.sub as string;
  }

  // Try custom header
  if (event.headers?.['x-user-id']) {
    return event.headers['x-user-id'];
  }

  return null;
}

/**
 * Lambda handler for cycle tracking operations
 * Endpoints:
 * - GET /cycles - Get user's cycle history
 * - POST /cycles - Log new cycle entry
 * - PUT /cycles/{id} - Update cycle entry
 * - GET /cycles/predictions - Get cycle predictions
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path, pathParameters } = event;

    // Handle OPTIONS for CORS preflight
    if (httpMethod === 'OPTIONS') {
      return successResponse(200, {});
    }

    // Get userId from request
    const userId = getUserId(event);
    if (!userId) {
      return errorResponse(400, 'VALIDATION_ERROR', 'userId is required', ['userId']);
    }

    // Handle predictions endpoint
    if (path.endsWith('/predictions') && httpMethod === 'GET') {
      const cycles = await getCycles(userId);

      if (cycles.length === 0) {
        return successResponse(200, {
          predictions: null,
          message: 'No cycle data available. Log at least 3 complete cycles for predictions.',
          cycleCount: 0,
        });
      }

      const predictions = calculatePredictions(cycles);

      if (!predictions) {
        const completeCycles = cycles.filter((c) => c.cycleLength !== undefined);
        return successResponse(200, {
          predictions: null,
          message: `Need at least 3 complete cycles for predictions. Currently have ${completeCycles.length} complete cycle(s).`,
          cycleCount: cycles.length,
          completeCycleCount: completeCycles.length,
        });
      }

      return successResponse(200, {
        predictions,
        cycleCount: cycles.length,
      });
    }

    // Handle cycle by ID (PUT)
    if (pathParameters?.id && httpMethod === 'PUT') {
      const cycleId = pathParameters.id;

      // Parse and validate request body
      let input: Partial<CycleLogInput>;
      try {
        input = event.body ? JSON.parse(event.body) : {};
      } catch {
        return errorResponse(400, 'VALIDATION_ERROR', 'Invalid JSON in request body');
      }

      // Validate input for update (partial validation)
      const errors: ValidationError[] = [];

      if (input.endDate !== undefined && input.endDate !== null && input.endDate !== '') {
        if (!validateDateFormat(input.endDate)) {
          errors.push({ field: 'endDate', message: 'endDate must be in ISO format (YYYY-MM-DD)' });
        }
      }

      if (input.flowIntensity !== undefined) {
        if (!validateEnum(input.flowIntensity, [...VALID_FLOW_INTENSITIES])) {
          errors.push({
            field: 'flowIntensity',
            message: "flowIntensity must be one of: 'light', 'medium', 'heavy'",
          });
        }
      }

      if (errors.length > 0) {
        return errorResponse(
          400,
          'VALIDATION_ERROR',
          errors.map((e) => e.message).join('; '),
          errors.map((e) => e.field)
        );
      }

      const updatedCycle = await updateCycle(userId, cycleId, input);

      if (!updatedCycle) {
        return errorResponse(404, 'NOT_FOUND', `Cycle with id ${cycleId} not found`);
      }

      return successResponse(200, {
        message: 'Cycle updated successfully',
        cycle: updatedCycle,
      });
    }

    // Handle base cycles endpoint
    switch (httpMethod) {
      case 'GET': {
        const cycles = await getCycles(userId);
        return successResponse(200, {
          cycles,
          count: cycles.length,
        });
      }

      case 'POST': {
        // Parse and validate request body
        let input: CycleLogInput;
        try {
          input = event.body ? JSON.parse(event.body) : {};
        } catch {
          return errorResponse(400, 'VALIDATION_ERROR', 'Invalid JSON in request body');
        }

        // Validate input
        const errors = validateCycleInput(input);
        if (errors.length > 0) {
          return errorResponse(
            400,
            'VALIDATION_ERROR',
            errors.map((e) => e.message).join('; '),
            errors.map((e) => e.field)
          );
        }

        // Create the cycle entry
        const cycle = await createCycle(userId, input);

        return successResponse(201, {
          message: 'Cycle logged successfully',
          cycle,
        });
      }

      default:
        return errorResponse(405, 'METHOD_NOT_ALLOWED', `Method ${httpMethod} not allowed`);
    }
  } catch (error) {
    console.error('Error in cycleHandler:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'An error occurred');
  }
};
