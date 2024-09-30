import * as uuid from 'uuid'

import { TodosAccess } from '../dataLayer/todosAccess.mjs'

const todosAccess = new TodosAccess()

export async function getAllTodos(userId) {
  return todosAccess.getAllTodosByUser(userId)
}

export async function createTodo(createTodoRequest, userId) {
  const itemId = uuid.v4()

  return await todosAccess.createTodo({
    todoId: itemId,
    userId: userId,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date(),
    name: createTodoRequest.name
  })
}

export async function updateTodo(updatedTodo, todoId) {
  return await todosAccess.updateTodo(updatedTodo, todoId)
}

export async function deleteTodo(todoId) {
  return await todosAccess.deleteTodo(todoId)
}

export async function todoExistsForUser(todoId, userId) {
  return await todosAccess.todoExistsForUser(todoId, userId)
}
