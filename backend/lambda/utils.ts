import { APIGatewayProxyResult } from 'aws-lambda';
import { randomUUID } from 'crypto';

// ============================================
// Response Formatting Helpers
// ============================================

/** Standard CORS headers for API Gateway responses */
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

/**
 * Creates a successful API Gateway response with CORS headers
 * @param statusCode - HTTP status code (e.g., 200, 201)
 * @param body - Response body object to be JSON stringified
 * @returns Formatted API Gateway response
 */
export function successResponse(statusCode: number, body: unknown): APIGatewayProxyResult {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
}

/**
 * Creates an error API Gateway response with CORS headers
 * @param statusCode - HTTP status code (e.g., 400, 404, 500)
 * @param error - Error code (e.g., 'VALIDATION_ERROR', 'NOT_FOUND')
 * @param message - Human-readable error message
 * @param fields - Optional array of field names that caused the error
 * @returns Formatted API Gateway error response
 */
export function errorResponse(
  statusCode: number,
  error: string,
  message: string,
  fields?: string[]
): APIGatewayProxyResult {
  const body: { error: string; message: string; fields?: string[] } = {
    error,
    message,
  };

  if (fields && fields.length > 0) {
    body.fields = fields;
  }

  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
}


// ============================================
// Validation Helpers
// ============================================

/** Result of validation check */
export interface ValidationResult {
  valid: boolean;
  missingFields?: string[];
}

/**
 * Validates that required fields exist and are not empty in an object
 * @param obj - Object to validate
 * @param fields - Array of required field names
 * @returns ValidationResult with valid status and missing fields if any
 */
export function validateRequired(obj: Record<string, unknown>, fields: string[]): ValidationResult {
  const missingFields: string[] = [];

  for (const field of fields) {
    const value = obj[field];
    if (value === undefined || value === null || value === '') {
      missingFields.push(field);
    }
  }

  return {
    valid: missingFields.length === 0,
    missingFields: missingFields.length > 0 ? missingFields : undefined,
  };
}

/**
 * Validates that a string is in ISO date format (YYYY-MM-DD)
 * @param dateStr - Date string to validate
 * @returns true if valid ISO date format, false otherwise
 */
export function validateDateFormat(dateStr: string): boolean {
  if (!dateStr || typeof dateStr !== 'string') {
    return false;
  }

  // Check ISO date format: YYYY-MM-DD
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!isoDateRegex.test(dateStr)) {
    return false;
  }

  // Verify it's a valid date
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
}

/**
 * Validates that a value is in an allowed list of values
 * @param value - Value to validate
 * @param allowedValues - Array of allowed values
 * @returns true if value is in allowed list, false otherwise
 */
export function validateEnum<T>(value: T, allowedValues: T[]): boolean {
  return allowedValues.includes(value);
}

/**
 * Validates that a numeric value is within a specified range (inclusive)
 * @param value - Numeric value to validate
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns true if value is within range, false otherwise
 */
export function validateRange(value: number, min: number, max: number): boolean {
  if (typeof value !== 'number' || isNaN(value)) {
    return false;
  }
  return value >= min && value <= max;
}

// ============================================
// DynamoDB Key Helpers
// ============================================

/**
 * Creates a DynamoDB partition key for a user
 * @param userId - User identifier
 * @returns Formatted user key: USER#{userId}
 */
export function createUserKey(userId: string): string {
  return `USER#${userId}`;
}

/**
 * Creates a DynamoDB sort key for a cycle entry
 * @param startDate - Cycle start date in ISO format
 * @returns Formatted cycle key: CYCLE#{startDate}
 */
export function createCycleKey(startDate: string): string {
  return `CYCLE#${startDate}`;
}

/**
 * Creates a DynamoDB partition key for a forum thread
 * @param threadId - Thread identifier
 * @returns Formatted thread key: THREAD#{threadId}
 */
export function createThreadKey(threadId: string): string {
  return `THREAD#${threadId}`;
}

/**
 * Creates a DynamoDB sort key for a symptom entry
 * @param date - Symptom date in ISO format
 * @returns Formatted symptom key: SYMPTOM#{date}
 */
export function createSymptomKey(date: string): string {
  return `SYMPTOM#${date}`;
}

/**
 * Creates a DynamoDB sort key for a forum reply
 * @param timestamp - Reply timestamp in ISO format
 * @param replyId - Reply identifier
 * @returns Formatted reply key: REPLY#{timestamp}#{replyId}
 */
export function createReplyKey(timestamp: string, replyId: string): string {
  return `REPLY#${timestamp}#${replyId}`;
}

// ============================================
// Date Utilities
// ============================================

/**
 * Returns the current date in ISO format (YYYY-MM-DD)
 * @returns Current date string in ISO format
 */
export function getCurrentISODate(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Returns the current timestamp in ISO format
 * @returns Current timestamp string in ISO format
 */
export function getCurrentISOTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Generates a unique identifier using UUID v4
 * @returns Unique identifier string
 */
export function generateId(): string {
  return randomUUID();
}
