import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

// Initialize AWS SDK v3 clients
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const sesClient = new SESClient({});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No request body provided" }),
      };
    }

    const requestBody = JSON.parse(event.body);
    const { email } = requestBody;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email is required" }),
      };
    }

    const tableName = process.env.TABLE_NAME;
    if (!tableName) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Table name not found in environment variables" }),
      };
    }

    // Save to DynamoDB
    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          email,
          subscriptionDate: new Date().toISOString(),
        },
      })
    );

    // Send notification email
    const emailParams = {
      Source: "siddadeepika@gmail.com", // SES verified email
      Destination: {
        ToAddresses: ["siddadeepika@gmail.com"], // The email to receive the notification
      },
      Message: {
        Subject: { Data: "New Swasthyashe Subscription" },
        Body: { Text: { Data: `New subscription from: ${email}` } },
      },
    };

    await sesClient.send(new SendEmailCommand(emailParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Subscription successful" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};
