// import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'patch',
        path: 'todos/{todoId}/attachment',
        cors: true,
        authorizer: 'auth0Authorizer'
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:GetItem', 'dynamodb:UpdateItem'],
      Resource: [
        'arn:aws:dynamodb:${self:provider.region}:*:table/${self:provider.environment.TODOS_TABLE}'
      ]
    },
    {
      Effect: 'Allow',
      Action: ['s3:PutObject', 's3:GetObject'],
      Resource: [
        'arn:aws:s3:::${self:provider.environment.ATTACHMENT_S3_BUCKET}/*'
      ]
    }
  ]
};
