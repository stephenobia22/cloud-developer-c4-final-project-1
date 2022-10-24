import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getAllUserTodos } from "../../businessLogic/todos";
// import { getUserId } from '../utils';

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    const todos = await getAllUserTodos(event);

    if (todos.length !== 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          items: todos,
        }),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({
        items: "",
      }),
    };
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
