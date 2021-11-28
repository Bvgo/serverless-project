import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { getUserId } from '../../auth/utils';
import { deleteTodo as removeTodo, getOne } from 'src/businessLogic/todos';
import { createLogger } from 'src/utils/logger';

const logger = createLogger('DeletTodo');

const deleteTodo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event
) => {
  logger.info('Deleting Todo: ', { todoId: event.pathParameters });
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event.headers.Authorization) as string;

  const todo = await getOne({ userId, todoId });

  if (userId !== todo.Item.userId) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        error: `You dont permission to delete ${todo.Item.name}`
      })
    };
  }

  await removeTodo({ todoId, userId });

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'success',
      message: `${todo.Item.name} deleted`
    })
  };
};

export const main = middyfy(deleteTodo);
