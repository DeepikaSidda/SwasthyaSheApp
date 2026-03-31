import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { successResponse, errorResponse, createUserKey, getCurrentISOTimestamp, getCurrentISODate } from './utils';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.USER_PROFILES_TABLE_NAME || '';

function getUserId(event: APIGatewayProxyEvent): string {
  return event.queryStringParameters?.userId || 'demo-user';
}

async function getItem(pk: string, sk: string) {
  const result = await docClient.send(new GetCommand({ TableName: TABLE_NAME, Key: { PK: pk, SK: sk } }));
  return result.Item || null;
}

async function putItem(pk: string, sk: string, userId: string, data: Record<string, unknown>) {
  await docClient.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: { PK: pk, SK: sk, userId, ...data, updatedAt: getCurrentISOTimestamp() },
  }));
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path } = event;

    if (httpMethod === 'OPTIONS') return successResponse(200, {});

    const userId = getUserId(event);
    const pk = createUserKey(userId);

    // --- Water tracking: /profile/water ---
    if (path.endsWith('/water')) {
      const today = getCurrentISODate();
      const sk = `WATER#${today}`;

      if (httpMethod === 'GET') {
        const item = await getItem(pk, sk);
        return successResponse(200, { water: item ? { count: item.count, date: item.date } : { count: 0, date: today } });
      }
      if (httpMethod === 'POST') {
        let body: Record<string, unknown>;
        try { body = event.body ? JSON.parse(event.body) : {}; } catch { return errorResponse(400, 'VALIDATION_ERROR', 'Invalid JSON'); }
        const count = typeof body.count === 'number' ? body.count : 0;
        await putItem(pk, sk, userId, { count, date: today });
        return successResponse(200, { water: { count, date: today } });
      }
    }

    // --- User preferences: /profile/preferences ---
    if (path.endsWith('/preferences')) {
      const sk = 'PREFERENCES';

      if (httpMethod === 'GET') {
        const item = await getItem(pk, sk);
        return successResponse(200, { preferences: item?.preferences || null });
      }
      if (httpMethod === 'POST') {
        let body: Record<string, unknown>;
        try { body = event.body ? JSON.parse(event.body) : {}; } catch { return errorResponse(400, 'VALIDATION_ERROR', 'Invalid JSON'); }
        await putItem(pk, sk, userId, { preferences: body });
        return successResponse(200, { preferences: body });
      }
    }

    // --- Health profile: /profile ---
    const sk = 'HEALTH_PROFILE';

    if (httpMethod === 'GET') {
      const item = await getItem(pk, sk);
      return successResponse(200, { profile: item?.profile || null });
    }

    if (httpMethod === 'POST' || httpMethod === 'PUT') {
      let body: Record<string, unknown>;
      try { body = event.body ? JSON.parse(event.body) : {}; } catch { return errorResponse(400, 'VALIDATION_ERROR', 'Invalid JSON'); }
      await putItem(pk, sk, userId, { profile: body });
      return successResponse(200, { message: 'Profile saved', profile: body });
    }

    return errorResponse(405, 'METHOD_NOT_ALLOWED', `Method ${httpMethod} not allowed`);
  } catch (error) {
    console.error('Error in profileHandler:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'An error occurred');
  }
};
