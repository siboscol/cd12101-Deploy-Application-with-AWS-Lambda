import { ImagesAccess } from '../dataLayer/ImagesAccess.mjs'

const todosAccess = new ImagesAccess()

export async function createImage(todoId, newImage) {
  return await todosAccess.createImage(todoId, newImage)
}

export async function getUploadUrl(imageId) {
  return await todosAccess.getUploadUrl(imageId)
}
