import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getUserId } from 'src/auth/utils';
import { getOne } from 'src/businessLogic/todos';
import schema from './schema';
import { createLogger } from 'src/utils/logger';

const logger = createLogger('getTodo');

const getTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event.headers.Authorization) as string;

  logger.info('Fetching todo for: ', { userId });

  const result = await getOne({ userId, todoId });

  if (Boolean(result.Item)) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: `Todo id ${todoId} not found` })
    };
  }

  logger.info('Result: ', result);

  // Return result
  return {
    statusCode: 200,
    body: JSON.stringify({
      item: result.Item
      // Encode the JSON object so a client can return it in a URL as is
    })
  };
};

export const main = middyfy(getTodo);
