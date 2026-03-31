import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class SwasthyasheStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table for Email Subscriptions
    const subscriptionsTable = new dynamodb.Table(this, 'Subscriptions', {
      partitionKey: { name: 'email', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production
    });

    // DynamoDB Table for Cycle Tracking
    // PK: USER#{userId}, SK: CYCLE#{startDate}
    const cyclesTable = new dynamodb.Table(this, 'CyclesTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production
    });

    // GSI for querying recent cycles by start date
    cyclesTable.addGlobalSecondaryIndex({
      indexName: 'byStartDate',
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'startDate', type: dynamodb.AttributeType.STRING },
    });

    // DynamoDB Table for Community Forum
    // PK: THREAD#{threadId}, SK: METADATA or REPLY#{timestamp}#{replyId}
    const forumTable = new dynamodb.Table(this, 'ForumTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production
    });

    // GSI for filtering threads by category
    forumTable.addGlobalSecondaryIndex({
      indexName: 'byCategory',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
    });

    // GSI for sorting threads by last activity
    forumTable.addGlobalSecondaryIndex({
      indexName: 'byLastActivity',
      partitionKey: { name: 'entityType', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'lastActivityAt', type: dynamodb.AttributeType.STRING },
    });

    // DynamoDB Table for Symptom Tracking
    // PK: USER#{userId}, SK: SYMPTOM#{date}
    const symptomsTable = new dynamodb.Table(this, 'SymptomsTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production
    });

    // DynamoDB Table for User Profiles (dosha, language preferences)
    // PK: USER#{userId}, SK: PROFILE
    const userProfilesTable = new dynamodb.Table(this, 'UserProfilesTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production
    });

    // Lambda Function for Subscription Handler
    const subscriptionHandler = new lambda.Function(this, 'SubscriptionHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'subscription.handler',
      code: lambda.Code.fromAsset('dist/lambda'),
      environment: {
        TABLE_NAME: subscriptionsTable.tableName, // Pass DynamoDB table name as an environment variable
        NOTIFICATION_EMAIL: 'siddadeepika@gmail.com', // Replace with your email
      },
    });

    // Grant Lambda permissions to DynamoDB and SES
    subscriptionsTable.grantWriteData(subscriptionHandler);
    subscriptionHandler.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
      effect: cdk.aws_iam.Effect.ALLOW,
      actions: ['ses:SendEmail', 'ses:SendRawEmail'],
      resources: ['*'], // Scope this down in production
    }));

    // Lambda Function for Cycle Handler
    const cycleHandler = new lambda.Function(this, 'CycleHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'cycleHandler.handler',
      code: lambda.Code.fromAsset('dist/lambda'),
      environment: {
        CYCLES_TABLE_NAME: cyclesTable.tableName,
      },
    });

    // Grant Cycle Handler permissions to DynamoDB
    cyclesTable.grantReadWriteData(cycleHandler);

    // Lambda Function for Forum Handler
    const forumHandler = new lambda.Function(this, 'ForumHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'forumHandler.handler',
      code: lambda.Code.fromAsset('dist/lambda'),
      environment: {
        FORUM_TABLE_NAME: forumTable.tableName,
      },
    });

    // Grant Forum Handler permissions to DynamoDB
    forumTable.grantReadWriteData(forumHandler);

    // Lambda Function for Symptom Handler
    const symptomHandler = new lambda.Function(this, 'SymptomHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'symptomHandler.handler',
      code: lambda.Code.fromAsset('dist/lambda'),
      environment: {
        SYMPTOMS_TABLE_NAME: symptomsTable.tableName,
      },
    });

    // Grant Symptom Handler permissions to DynamoDB
    symptomsTable.grantReadWriteData(symptomHandler);

    // Lambda Function for Search Handler
    const searchHandler = new lambda.Function(this, 'SearchHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'searchHandler.handler',
      code: lambda.Code.fromAsset('dist/lambda'),
      environment: {
        FORUM_TABLE_NAME: forumTable.tableName,
      },
    });

    // Grant Search Handler read permissions to Forum table for searching forum content
    forumTable.grantReadData(searchHandler);

    // Lambda Function for Wellness Handler
    const wellnessHandler = new lambda.Function(this, 'WellnessHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'wellnessHandler.handler',
      code: lambda.Code.fromAsset('dist/lambda'),
      environment: {
        USER_PROFILES_TABLE_NAME: userProfilesTable.tableName,
        CYCLES_TABLE_NAME: cyclesTable.tableName,
        SYMPTOMS_TABLE_NAME: symptomsTable.tableName,
      },
    });

    // Grant Wellness Handler permissions to DynamoDB tables
    userProfilesTable.grantReadWriteData(wellnessHandler);
    cyclesTable.grantReadData(wellnessHandler);
    symptomsTable.grantReadData(wellnessHandler);

    // Lambda Function for Profile Handler
    const profileHandler = new lambda.Function(this, 'ProfileHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'profileHandler.handler',
      code: lambda.Code.fromAsset('dist/lambda'),
      environment: {
        USER_PROFILES_TABLE_NAME: userProfilesTable.tableName,
      },
    });

    // Grant Profile Handler permissions to DynamoDB
    userProfilesTable.grantReadWriteData(profileHandler);

    // Lambda Function for AI Chat (Bedrock)
    const aiChatHandler = new lambda.Function(this, 'AiChatHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'aiChatHandler.handler',
      code: lambda.Code.fromAsset('dist/lambda'),
      timeout: cdk.Duration.seconds(30),
      environment: {
        BEDROCK_REGION: 'us-east-1',
        MODEL_ID: 'us.meta.llama3-2-3b-instruct-v1:0',
      },
    });

    // Grant Bedrock invoke permissions
    aiChatHandler.addToRolePolicy(new cdk.aws_iam.PolicyStatement({
      effect: cdk.aws_iam.Effect.ALLOW,
      actions: ['bedrock:InvokeModel'],
      resources: ['*'],
    }));

    // API Gateway REST API
    const api = new apigateway.RestApi(this, 'SwasthyasheApi', {
      restApiName: 'Swasthyashe API',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // API Gateway Integration for Subscription
    const subscriptionIntegration = new apigateway.LambdaIntegration(subscriptionHandler);
    api.root.addResource('subscribe').addMethod('POST', subscriptionIntegration);

    // API Gateway Integration for Cycles
    const cycleIntegration = new apigateway.LambdaIntegration(cycleHandler);
    const cyclesResource = api.root.addResource('cycles');
    cyclesResource.addMethod('GET', cycleIntegration);  // GET /cycles - Get user's cycle history
    cyclesResource.addMethod('POST', cycleIntegration); // POST /cycles - Log new cycle entry

    const cycleIdResource = cyclesResource.addResource('{id}');
    cycleIdResource.addMethod('PUT', cycleIntegration); // PUT /cycles/{id} - Update cycle entry

    const cyclePredictionsResource = cyclesResource.addResource('predictions');
    cyclePredictionsResource.addMethod('GET', cycleIntegration); // GET /cycles/predictions - Get cycle predictions

    // API Gateway Integration for Forum
    const forumIntegration = new apigateway.LambdaIntegration(forumHandler);
    const forumResource = api.root.addResource('forum');
    const threadsResource = forumResource.addResource('threads');
    threadsResource.addMethod('GET', forumIntegration);  // GET /forum/threads - List forum threads
    threadsResource.addMethod('POST', forumIntegration); // POST /forum/threads - Create new thread

    const threadIdResource = threadsResource.addResource('{id}');
    threadIdResource.addMethod('GET', forumIntegration); // GET /forum/threads/{id} - Get thread with replies

    const repliesResource = threadIdResource.addResource('replies');
    repliesResource.addMethod('POST', forumIntegration); // POST /forum/threads/{id}/replies - Add reply to thread

    // API Gateway Integration for Symptoms
    const symptomIntegration = new apigateway.LambdaIntegration(symptomHandler);
    const symptomsResource = api.root.addResource('symptoms');
    symptomsResource.addMethod('GET', symptomIntegration);  // GET /symptoms - Get symptom history
    symptomsResource.addMethod('POST', symptomIntegration); // POST /symptoms - Log symptoms

    const symptomRecommendationsResource = symptomsResource.addResource('recommendations');
    symptomRecommendationsResource.addMethod('GET', symptomIntegration); // GET /symptoms/recommendations - Get Ayurvedic recommendations

    // API Gateway Integration for Search
    const searchIntegration = new apigateway.LambdaIntegration(searchHandler);
    const searchResource = api.root.addResource('search');
    searchResource.addMethod('GET', searchIntegration); // GET /search - Search across content

    // API Gateway Integration for Wellness
    const wellnessIntegration = new apigateway.LambdaIntegration(wellnessHandler);
    const wellnessResource = api.root.addResource('wellness');
    
    const doshaResource = wellnessResource.addResource('dosha');
    doshaResource.addMethod('GET', wellnessIntegration);  // GET /wellness/dosha - Get user's dosha profile
    doshaResource.addMethod('POST', wellnessIntegration); // POST /wellness/dosha - Save dosha assessment

    const doshaHistoryResource = doshaResource.addResource('history');
    doshaHistoryResource.addMethod('GET', wellnessIntegration); // GET /wellness/dosha/history - Get assessment history

    const planResource = wellnessResource.addResource('plan');
    planResource.addMethod('GET', wellnessIntegration); // GET /wellness/plan - Get personalized wellness plan

    // API Gateway Integration for AI Chat
    const aiChatIntegration = new apigateway.LambdaIntegration(aiChatHandler);
    const aiChatResource = api.root.addResource('ai-chat');
    aiChatResource.addMethod('POST', aiChatIntegration); // POST /ai-chat - AI wellness coach chat

    // API Gateway Integration for Profile
    const profileIntegration = new apigateway.LambdaIntegration(profileHandler);
    const profileResource = api.root.addResource('profile');
    profileResource.addMethod('GET', profileIntegration);  // GET /profile - Get health profile
    profileResource.addMethod('POST', profileIntegration); // POST /profile - Save health profile

    const profileWaterResource = profileResource.addResource('water');
    profileWaterResource.addMethod('GET', profileIntegration);  // GET /profile/water - Get water count
    profileWaterResource.addMethod('POST', profileIntegration); // POST /profile/water - Save water count

    const profilePrefsResource = profileResource.addResource('preferences');
    profilePrefsResource.addMethod('GET', profileIntegration);  // GET /profile/preferences - Get preferences
    profilePrefsResource.addMethod('POST', profileIntegration); // POST /profile/preferences - Save preferences

    // Cognito User Pool for Authentication
    const userPool = new cognito.UserPool(this, 'SwasthyasheUserPool', {
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: {
        email: { required: true, mutable: true },
        fullname: { required: false, mutable: true },
      },
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Cognito User Pool Client with OAuth authorization code grant
    const userPoolClient = userPool.addClient('SwasthyasheWebClient', {
      generateSecret: false,
      oAuth: {
        flows: { authorizationCodeGrant: true, implicitCodeGrant: true },
        scopes: [
          cognito.OAuthScope.OPENID,
          cognito.OAuthScope.EMAIL,
          cognito.OAuthScope.PROFILE,
        ],
        callbackUrls: ['http://localhost:3000', 'http://localhost:3000/'],
        logoutUrls: ['http://localhost:3000', 'http://localhost:3000/'],
      },
      supportedIdentityProviders: [
        cognito.UserPoolClientIdentityProvider.COGNITO,
      ],
    });

    // Cognito User Pool Domain for Hosted UI
    const userPoolDomain = userPool.addDomain('SwasthyasheDomain', {
      cognitoDomain: { domainPrefix: 'swasthyashe-auth' },
    });

    // Outputs for frontend configuration
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
      description: 'Cognito User Pool ID',
    });

    new cdk.CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId,
      description: 'Cognito User Pool Client ID',
    });

    new cdk.CfnOutput(this, 'UserPoolDomain', {
      value: `${userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com`,
      description: 'Cognito User Pool Domain',
    });
  }
}
