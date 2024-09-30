import { ImagesAccess } from '../dataLayer/ImagesAccess.mjs'

const todosAccess = new ImagesAccess()

export async function createImage(todoId, imageId, newImage) {
  return await todosAccess.createImage(todoId, imageId, newImage)
}

export async function getUploadUrl(imageId) {
  return await todosAccess.getUploadUrl(imageId)
}
