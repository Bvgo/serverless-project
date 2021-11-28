import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);
import { TodosAccess } from 'src/dataLayer/TodosAccess';
import { GetTodoParams } from 'src/models/Todo';
const todoAccess = new TodosAccess();

const s3 = new XAWS.S3({ signatureVersion: 'v4' });

// TODO: Implement the fileStogare logic

const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SINGNED_URL_EXPIRATION;

export async function todoExists(params: GetTodoParams) {
  const result = await todoAccess.getTodo(params);

  return Boolean(result.Item);
}

export function createAttachmentPresignedUrl(todoId: string) {
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`;
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: parseInt(urlExpiration)
  });

  return { imageUrl, uploadUrl };
}
