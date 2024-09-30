import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../auth/utils.mjs'
import { deleteTodo, todoExistsForUser } from '../../businessLogic/todos.mjs'
import createError from 'http-errors'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId

    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)

    const validTodoId = await todoExistsForUser(todoId, userId)

    if (!validTodoId) {
      throw createError(
        404,
        JSON.stringify({
          error: 'Todo not found for user'
        })
      )
    }

    await deleteTodo(todoId, userId)

    return {
      statusCode: 204
    }
  })
