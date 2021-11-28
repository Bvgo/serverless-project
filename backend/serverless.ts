import type { AWS } from '@serverless/typescript';

import Lambdas from './src/functions';


const serverlessConfiguration: AWS = {
  service: 'serverless-todo',
  frameworkVersion: '2',
  variablesResolutionMode: '20210326',
  package: { individually: true },
  plugins: [
    'serverless-esbuild',
    'serverless-iam-roles-per-function',
    'serverless-plugin-tracing'
  ],
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node'
    },
    'serverless-iam-roles-per-function': {
      defaultInherit: true
    }
  },

  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-west-2',
    stage: "${opt: stage, 'dev'}",
    lambdaHashingVersion: '20201221',
    tracing: { lambda: true, apiGateway: true },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      TODOS_TABLE: 'Todos-${self:provider.stage}',
      TODOS_CREATED_AT_INDEX: 'CreatedAtIndex',
      ATTACHMENT_S3_BUCKET:
        '117147402333-todo-app-images-${self:provider.stage}',
      SINGNED_URL_EXPIRATION: '600'
    },
    logs: { restApi: true },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: ['xray:PutTelemetryRecords', 'xray: PutTraceSegments'],
            Resource: '*'
          }
        ]
      }
    }
  },
  // import the function via paths
  functions: Lambdas,

  resources: {
    Resources: {
      AttachmentBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.ATTACHMENT_S3_BUCKET}',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ['*'],
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT', 'POST', 'HEAD', 'DELETE'],
                MaxAge: 3000
              }
            ]
          }
        }
      },
      BucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          PolicyDocument: {
            Id: 'TodoImagePolicy',
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'PublicReadForGetBucketObjects',
                Effect: 'Allow',
                Principal: '*',
                Action: 's3:GetObject',
                Resource:
                  'arn:aws:s3:::${self:provider.environment.ATTACHMENT_S3_BUCKET}/*'
              }
            ]
          },
          Bucket: '${self:provider.environment.ATTACHMENT_S3_BUCKET}'
        }
      },
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers':
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            'gatewayresponse.header.Access-Control-Allow-Methods':
              "'GET,OPTIONS,POST'"
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: { Ref: 'ApiGatewayRestApi' }
        }
      },
      TodosTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          AttributeDefinitions: [
            { AttributeName: 'userId', AttributeType: 'S' },
            { AttributeName: 'todoId', AttributeType: 'S' },
            { AttributeName: 'createdAt', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' },
            { AttributeName: 'todoId', KeyType: 'RANGE' }
          ],
          BillingMode: 'PAY_PER_REQUEST',
          TableName: '${self:provider.environment.TODOS_TABLE}',
          LocalSecondaryIndexes: [
            {
              IndexName: '${self:provider.environment.TODOS_CREATED_AT_INDEX}',
              KeySchema: [
                { AttributeName: 'userId', KeyType: 'HASH' },
                { AttributeName: 'createdAt', KeyType: 'RANGE' }
              ],
              Projection: { ProjectionType: 'ALL' }
            }
          ]
        }
      }
    }
  }
};


module.exports = serverlessConfiguration;