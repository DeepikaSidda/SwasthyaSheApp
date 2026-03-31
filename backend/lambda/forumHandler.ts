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
  createThreadKey,
  createReplyKey,
  getCurrentISOTimestamp,
  generateId,
} from './utils';

// Initialize DynamoDB client
const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

const TABLE_NAME = process.env.FORUM_TABLE_NAME || 'SwasthyasheForum';

// Valid forum categories
const VALID_CATEGORIES = ['Period Health', 'Mental Wellness', 'Pregnancy', 'Ayurveda', 'General'] as const;
type ForumCategory = (typeof VALID_CATEGORIES)[number];

// Forum thread interface
interface ForumThread {
  PK: string;           // THREAD#{threadId}
  SK: string;           // METADATA
  threadId: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  tags: ForumCategory[];
  replyCount: number;
  createdAt: string;
  lastActivityAt: string;
  entityType: string;   // For GSI: 'THREAD'
  category?: string;    // Primary category for GSI filtering
}

// Forum reply interface
interface ForumReply {
  PK: string;           // THREAD#{threadId}
  SK: string;           // REPLY#{timestamp}#{replyId}
  replyId: string;
  threadId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

// Thread input interface
interface ThreadInput {
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  tags?: ForumCategory[];
}

// Reply input interface
interface ReplyInput {
  content: string;
  authorId: string;
  authorName: string;
}

// Validation error interface
interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates thread input data
 */
function validateThreadInput(input: Partial<ThreadInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate title
  if (!input.title || typeof input.title !== 'string') {
    errors.push({ field: 'title', message: 'title is required' });
  } else if (input.title.trim().length < 3) {
    errors.push({ field: 'title', message: 'title must be at least 3 characters' });
  } else if (input.title.length > 200) {
    errors.push({ field: 'title', message: 'title must be at most 200 characters' });
  }

  // Validate content
  if (!input.content || typeof input.content !== 'string') {
    errors.push({ field: 'content', message: 'content is required' });
  } else if (input.content.trim().length < 10) {
    errors.push({ field: 'content', message: 'content must be at least 10 characters' });
  } else if (input.content.length > 10000) {
    errors.push({ field: 'content', message: 'content must be at most 10000 characters' });
  }

  // Validate authorId
  if (!input.authorId || typeof input.authorId !== 'string') {
    errors.push({ field: 'authorId', message: 'authorId is required' });
  }

  // Validate authorName
  if (!input.authorName || typeof input.authorName !== 'string') {
    errors.push({ field: 'authorName', message: 'authorName is required' });
  }

  // Validate tags if provided
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) {
      errors.push({ field: 'tags', message: 'tags must be an array' });
    } else if (input.tags.length > 5) {
      errors.push({ field: 'tags', message: 'maximum 5 tags allowed' });
    } else {
      const invalidTags = input.tags.filter(tag => !VALID_CATEGORIES.includes(tag as ForumCategory));
      if (invalidTags.length > 0) {
        errors.push({ 
          field: 'tags', 
          message: `invalid tags: ${invalidTags.join(', ')}. Valid categories: ${VALID_CATEGORIES.join(', ')}` 
        });
      }
    }
  }

  return errors;
}

/**
 * Validates reply input data
 */
function validateReplyInput(input: Partial<ReplyInput>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate content
  if (!input.content || typeof input.content !== 'string') {
    errors.push({ field: 'content', message: 'content is required' });
  } else if (input.content.trim().length < 1) {
    errors.push({ field: 'content', message: 'content cannot be empty' });
  } else if (input.content.length > 10000) {
    errors.push({ field: 'content', message: 'content must be at most 10000 characters' });
  }

  // Validate authorId
  if (!input.authorId || typeof input.authorId !== 'string') {
    errors.push({ field: 'authorId', message: 'authorId is required' });
  }

  // Validate authorName
  if (!input.authorName || typeof input.authorName !== 'string') {
    errors.push({ field: 'authorName', message: 'authorName is required' });
  }

  return errors;
}


/**
 * Lists forum threads with pagination and optional category filtering
 * Sorted by lastActivityAt (most recent first)
 */
async function listThreads(category?: string, limit: number = 20, lastEvaluatedKey?: string): Promise<{
  threads: ForumThread[];
  nextToken?: string;
}> {
  let params: any;

  if (category && VALID_CATEGORIES.includes(category as ForumCategory)) {
    // Use byCategory GSI for filtering
    params = {
      TableName: TABLE_NAME,
      IndexName: 'byCategory',
      KeyConditionExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category,
      },
      ScanIndexForward: false, // Sort by createdAt descending
      Limit: limit,
    };
  } else {
    // Use byLastActivity GSI for all threads sorted by activity
    params = {
      TableName: TABLE_NAME,
      IndexName: 'byLastActivity',
      KeyConditionExpression: 'entityType = :entityType',
      ExpressionAttributeValues: {
        ':entityType': 'THREAD',
      },
      ScanIndexForward: false, // Sort by lastActivityAt descending
      Limit: limit,
    };
  }

  // Add pagination if lastEvaluatedKey provided
  if (lastEvaluatedKey) {
    try {
      params.ExclusiveStartKey = JSON.parse(Buffer.from(lastEvaluatedKey, 'base64').toString());
    } catch {
      // Invalid token, ignore
    }
  }

  const result = await docClient.send(new QueryCommand(params));
  const threads = (result.Items || []) as ForumThread[];

  // Build next token if there are more results
  let nextToken: string | undefined;
  if (result.LastEvaluatedKey) {
    nextToken = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64');
  }

  return { threads, nextToken };
}

/**
 * Creates a new forum thread
 */
async function createThread(input: ThreadInput): Promise<ForumThread> {
  const now = getCurrentISOTimestamp();
  const threadId = generateId();
  const pk = createThreadKey(threadId);

  // Use first tag as primary category for GSI, default to 'General'
  const tags = input.tags && input.tags.length > 0 ? input.tags : ['General' as ForumCategory];
  const primaryCategory = tags[0];

  const thread: ForumThread = {
    PK: pk,
    SK: 'METADATA',
    threadId,
    title: input.title.trim(),
    content: input.content.trim(),
    authorId: input.authorId,
    authorName: input.authorName,
    tags,
    replyCount: 0,
    createdAt: now,
    lastActivityAt: now,
    entityType: 'THREAD',
    category: primaryCategory,
  };

  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: thread,
    })
  );

  return thread;
}

/**
 * Gets a thread by ID with its metadata
 */
async function getThread(threadId: string): Promise<ForumThread | null> {
  const pk = createThreadKey(threadId);

  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: 'METADATA' },
    })
  );

  return result.Item as ForumThread | null;
}

/**
 * Gets all replies for a thread, sorted by createdAt
 */
async function getThreadReplies(threadId: string): Promise<ForumReply[]> {
  const pk = createThreadKey(threadId);

  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :skPrefix)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':skPrefix': 'REPLY#',
      },
      ScanIndexForward: true, // Sort by SK ascending (oldest first)
    })
  );

  return (result.Items || []) as ForumReply[];
}

/**
 * Creates a reply to a thread and updates thread's replyCount and lastActivityAt
 */
async function createReply(threadId: string, input: ReplyInput): Promise<ForumReply> {
  const now = getCurrentISOTimestamp();
  const replyId = generateId();
  const pk = createThreadKey(threadId);
  const sk = createReplyKey(now, replyId);

  const reply: ForumReply = {
    PK: pk,
    SK: sk,
    replyId,
    threadId,
    content: input.content.trim(),
    authorId: input.authorId,
    authorName: input.authorName,
    createdAt: now,
  };

  // Save the reply
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: reply,
    })
  );

  // Update thread's replyCount and lastActivityAt
  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { PK: pk, SK: 'METADATA' },
      UpdateExpression: 'SET replyCount = replyCount + :inc, lastActivityAt = :lastActivityAt',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':lastActivityAt': now,
      },
    })
  );

  return reply;
}


/**
 * Lambda handler for forum operations
 * Endpoints:
 * - GET /forum/threads - List forum threads with pagination
 * - POST /forum/threads - Create new thread
 * - GET /forum/threads/{id} - Get thread with replies
 * - POST /forum/threads/{id}/replies - Add reply to thread
 */
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { httpMethod, path, pathParameters, queryStringParameters } = event;

    // Handle OPTIONS for CORS preflight
    if (httpMethod === 'OPTIONS') {
      return successResponse(200, {});
    }

    // Handle replies endpoint: POST /forum/threads/{id}/replies
    if (path.endsWith('/replies') && httpMethod === 'POST') {
      const threadId = pathParameters?.id;

      if (!threadId) {
        return errorResponse(400, 'VALIDATION_ERROR', 'threadId is required', ['threadId']);
      }

      // Check if thread exists
      const thread = await getThread(threadId);
      if (!thread) {
        return errorResponse(404, 'NOT_FOUND', `Thread with id ${threadId} not found`);
      }

      // Parse and validate request body
      let input: ReplyInput;
      try {
        input = event.body ? JSON.parse(event.body) : {};
      } catch {
        return errorResponse(400, 'VALIDATION_ERROR', 'Invalid JSON in request body');
      }

      // Validate input
      const errors = validateReplyInput(input);
      if (errors.length > 0) {
        return errorResponse(
          400,
          'VALIDATION_ERROR',
          errors.map((e) => e.message).join('; '),
          errors.map((e) => e.field)
        );
      }

      // Create the reply
      const reply = await createReply(threadId, input);

      return successResponse(201, {
        message: 'Reply added successfully',
        reply,
      });
    }

    // Handle thread by ID: GET /forum/threads/{id}
    if (pathParameters?.id && httpMethod === 'GET') {
      const threadId = pathParameters.id;

      // Get thread metadata
      const thread = await getThread(threadId);
      if (!thread) {
        return errorResponse(404, 'NOT_FOUND', `Thread with id ${threadId} not found`);
      }

      // Get thread replies
      const replies = await getThreadReplies(threadId);

      return successResponse(200, {
        thread,
        replies,
        replyCount: replies.length,
      });
    }

    // Handle base threads endpoint
    switch (httpMethod) {
      case 'GET': {
        // GET /forum/threads - List threads with optional category filter
        const category = queryStringParameters?.category;
        const limit = queryStringParameters?.limit ? parseInt(queryStringParameters.limit, 10) : 20;
        const nextToken = queryStringParameters?.nextToken;

        const result = await listThreads(category, Math.min(limit, 100), nextToken);

        return successResponse(200, {
          threads: result.threads,
          count: result.threads.length,
          nextToken: result.nextToken,
          ...(category && { filteredByCategory: category }),
        });
      }

      case 'POST': {
        // POST /forum/threads - Create new thread
        let input: ThreadInput;
        try {
          input = event.body ? JSON.parse(event.body) : {};
        } catch {
          return errorResponse(400, 'VALIDATION_ERROR', 'Invalid JSON in request body');
        }

        // Validate input
        const errors = validateThreadInput(input);
        if (errors.length > 0) {
          return errorResponse(
            400,
            'VALIDATION_ERROR',
            errors.map((e) => e.message).join('; '),
            errors.map((e) => e.field)
          );
        }

        // Create the thread
        const thread = await createThread(input);

        return successResponse(201, {
          message: 'Thread created successfully',
          thread,
        });
      }

      default:
        return errorResponse(405, 'METHOD_NOT_ALLOWED', `Method ${httpMethod} not allowed`);
    }
  } catch (error) {
    console.error('Error in forumHandler:', error);
    return errorResponse(500, 'INTERNAL_ERROR', 'An error occurred');
  }
};
