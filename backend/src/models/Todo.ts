export interface TodoItem {
  userId: string;
  todoId: string;
  createdAt: string;
  name: string;
  dueDate: string;
  done: boolean;
  attachmentUrl?: string;
}

export interface TodoUpdate {
  name: string;
  dueDate: string;
  done: boolean;
}

export interface GetParams {
  userId: string;
  limit?: number;
  nextKey?: string;
}

export interface CreateTodoRequest {
  name: string;
  dueDate: string;
}

export type NewTodo = Omit<TodoItem, 'todoId'>;

export interface AttachmentUpdateParams {
  userId: string;
  todoId: string;
  imageUrl: string;
}
export interface TodoDeleteParams {
  userId: string;
  todoId: string;
}
export interface GetTodoParams {
  userId: string;
  todoId: string;
}
export interface TodoUpdateParams {
  userId: string;
  todoId: string;
  update: TodoUpdate;
}
