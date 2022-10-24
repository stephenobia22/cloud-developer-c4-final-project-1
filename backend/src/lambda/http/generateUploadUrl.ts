import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";

import { createAttachmentPresignedUrl } from "../../businessLogic/todos";
import { TodoAccess } from "../../helpers/todosAcess";
import { getUserId } from '../utils'

const todoAccess = new TodoAccess()

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event)
    // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
    const todo = await todoAccess.getTodoUsingTodoIdAndUserId(todoId, userId)

    if(!todo){
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: 'Todo not found'
        })
      }
    }

    const url = await createAttachmentPresignedUrl(todoId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl: url,
      }),
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
