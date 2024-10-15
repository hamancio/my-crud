import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import 'dotenv/config';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const isLocal: boolean = process.env.NODE_ENV !== 'production';

const dynamoDBClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: isLocal ? process.env.DYNAMODB_LOCAL_ENDPOINT : undefined,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
  },
});

const dynamoDB = DynamoDBDocumentClient.from(dynamoDBClient);

export default dynamoDB;