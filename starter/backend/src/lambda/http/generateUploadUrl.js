import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import createError from 'http-errors'
import { todoExistsForUser } from '../../businessLogic/todos.mjs'
import { createImage, getUploadUrl } from '../../businessLogic/images.mjs'
import { getUserId } from '../auth/utils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    console.log('Caller event', event)
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

    const newItem = await createImage(todoId, event)

    const url = await getUploadUrl(imageId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        newItem: newItem,
        uploadUrl: url
      })
    }
  })
