import * as AWS from 'aws-sdk';
import * as XRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import {
  TodoItem,
  GetParams,
  TodoUpdateParams,
  AttachmentUpdateParams,
  TodoDeleteParams,
  GetTodoParams
} from 'src/models/Todo';

const XAWS = XRay.captureAWS(AWS);
export class TodosAccess {
  constructor(
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todoIndex = process.env.TODOS_CREATED_AT_INDEX,
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
  ) {}

  async getAll({ userId }: GetParams) {
    const params: DocumentClient.QueryInput = {
      TableName: this.todosTable,
      IndexName: this.todoIndex,
      ExpressionAttributeValues: {
        ':ud': userId
      },
      KeyConditionExpression: 'userId = :ud'
    };

    return await this.docClient.query(params).promise();
  }

  async create(todo: TodoItem) {
    const params: DocumentClient.PutItemInput = {
      TableName: this.todosTable,
      Item: todo
    };
    await this.docClient.put(params).promise();

    return todo;
  }

  async updateTodo({ userId, todoId, update }: TodoUpdateParams) {
    const params: DocumentClient.UpdateItemInput = {
      TableName: this.todosTable,
      Key: { todoId, userId },
      ExpressionAttributeNames: { '#title': 'name' },
      UpdateExpression: 'set #title = :nm, dueDate = :due, done = :don',
      ExpressionAttributeValues: {
        ':nm': update.name,
        ':due': update.dueDate,
        ':don': update.done
      },
      ReturnValues: 'ALL_NEW'
    };
    const updateResult = await this.docClient.update(params).promise();

    return updateResult.Attributes;
  }

  async updateTodoAttachment({
    todoId,
    imageUrl,
    userId
  }: AttachmentUpdateParams) {
    const params: DocumentClient.UpdateItemInput = {
      TableName: this.todosTable,
      Key: { todoId, userId },
      UpdateExpression: 'set attachmentUrl = :iur',
      ExpressionAttributeValues: {
        ':iur': imageUrl
      },
      ReturnValues: 'ALL_NEW'
    };
    const update = await this.docClient.update(params).promise();

    return update.Attributes;
  }

  async delete({ todoId, userId }: TodoDeleteParams) {
    const params: DocumentClient.DeleteItemInput = {
      TableName: this.todosTable,
      Key: { todoId, userId }
    };
    return await this.docClient.delete(params).promise();
  }

  async getTodo({ userId, todoId }: GetTodoParams) {
    const params: DocumentClient.GetItemInput = {
      TableName: this.todosTable,
      Key: { userId, todoId }
    };

    return await this.docClient.get(params).promise();
  }
}
