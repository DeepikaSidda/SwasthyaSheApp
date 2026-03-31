"use strict";
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };

  try {
    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'No request body provided' }) };
    }

    const { email } = JSON.parse(event.body);
    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ message: 'Email is required' }) };
    }

    const tableName = process.env.TABLE_NAME;
    if (!tableName) {
      return { statusCode: 500, headers, body: JSON.stringify({ message: 'Server config error' }) };
    }

    await docClient.send(new PutCommand({
      TableName: tableName,
      Item: { email, subscriptionDate: new Date().toISOString() },
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ message: 'Subscription successful! Thank you for subscribing.' }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ message: 'Internal server error' }) };
  }
};
