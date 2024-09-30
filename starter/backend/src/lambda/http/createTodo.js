import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../auth/utils.mjs'
import { createTodo } from '../../businessLogic/todos.mjs'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
  .handler(async (event) => {
    logger.info('Processing event: ', event)

    const newTodo = JSON.parse(event.body)

    const authorization = event.headers.Authorization
    const userId = getUserId(authorization)

    const newItem = await createTodo(newTodo, userId)

    return {
      statusCode: 201,
     body: JSON.stringify({
        newItem
      })
    }
  })