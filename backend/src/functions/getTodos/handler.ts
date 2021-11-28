import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getUserId } from 'src/auth/utils';
import { getAllTodos } from 'src/businessLogic/todos';

import schema from './schema';
import { createLogger } from 'src/utils/logger';

const logger = createLogger('getTodo');

const getTodos: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const userId = getUserId(event.headers.Authorization) as string;

  // logger.info('Fetching todos for: ', { userId });

  // let nextKey = getQueryParameter(event, 'nextKey');
  // let limit = getQueryParameter(event, 'limit');

  // logger.info('Query Params: ', { queryParams: event.queryStringParameters });

  // try {
  //   nextKey =
  //     nextKey === undefined ? nextKey : JSON.parse(decodeURIComponent(nextKey));

  //   limit = parseLimitParameter(event) || 100;
  // } catch (e) {
  //   console.log('Failed to pass query parameters: ', e.message);
  //   return {
  //     statusCode: 400,
  //     body: JSON.stringify({ error: 'Invalid Query parameters' })
  //   };
  // }

  const result = await getAllTodos({ userId });

  const items = result.Items;

  logger.info('Result: ', result);

  // Return result
  return {
    statusCode: 200,
    body: JSON.stringify({
      items
      // Encode the JSON object so a client can return it in a URL as is
      // nextKey: encodeNextKey(result.LastEvaluatedKey)
    })
  };
};

export const main = middyfy(getTodos);

// function getQueryParameter(event, name) {
//   const queryParams = event.queryStringParameters;
//   if (!queryParams) {
//     return undefined;
//   }

//   return queryParams[name];
// }

// function encodeNextKey(lastEvaluatedKey) {
//   if (!lastEvaluatedKey) {
//     return null;
//   }

//   return encodeURIComponent(JSON.stringify(lastEvaluatedKey));
// }

// function parseLimitParameter(event) {
//   const limitStr = getQueryParameter(event, 'limit');
//   if (!limitStr) {
//     return undefined;
//   }

//   const limit = parseInt(limitStr, 10);
//   if (limit <= 0) {
//     throw new Error('Limit should be positive');
//   }

//   return limit;
// }
