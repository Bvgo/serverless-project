import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { updateTodo as editTodo } from 'src/businessLogic/todos';
import schema from './schema';
import { getUserId } from '../../auth/utils';
import { createLogger } from 'src/utils/logger';

const logger = createLogger('updateTodo');

const updateTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  const todoId = event.pathParameters.todoId;
  logger.info('Updating Todo: ', { todoId });

  const userId = getUserId(event.headers.Authorization) as string;

  const updateResult = await editTodo({ userId, todoId, update: event.body });

  return {
    statusCode: 200,
    body: JSON.stringify({ updateResult })
  };
};

export const main = middyfy(updateTodo);
