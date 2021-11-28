import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { create } from 'src/businessLogic/todos';
import { getUserId } from 'src/auth/utils';
import { createLogger } from 'src/utils/logger';

const logger = createLogger('createTodo');

const createTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  logger.info('Creating new todo: ', { payload: event.body });

  const userId = getUserId(event.headers.Authorization) as string;

  const newTodo = await create(userId, event.body);

  return {
    statusCode: 201,
    body: JSON.stringify({ item: newTodo })
  };
};

export const main = middyfy(createTodo);
