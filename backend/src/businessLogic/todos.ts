import { v4 as uuidv4 } from 'uuid';
import { TodosAccess } from 'src/dataLayer/TodosAccess';
import {
  GetParams,
  CreateTodoRequest,
  AttachmentUpdateParams,
  TodoDeleteParams,
  TodoUpdateParams,
  GetTodoParams
} from 'src/models/Todo';

const todoAccess = new TodosAccess();

export async function getAllTodos(getParams: GetParams) {
  return todoAccess.getAll(getParams);
}

export async function create(userId: string, newTodo: CreateTodoRequest) {
  return await todoAccess.create({
    userId,
    todoId: uuidv4(),
    ...newTodo,
    createdAt: new Date().toISOString(),
    done: false
  });
}

export async function deleteTodo(params: TodoDeleteParams) {
  return todoAccess.delete(params);
}
export async function getOne(params: GetTodoParams) {
  return await todoAccess.getTodo(params);
}

export async function updateAttachmentUrl(params: AttachmentUpdateParams) {
  return await todoAccess.updateTodoAttachment(params);
}

export async function updateTodo(params: TodoUpdateParams) {
  return await todoAccess.updateTodo(params);
}
