import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import AWSXRay from 'aws-xray-sdk-core'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('ImagesAccess')

export class ImagesAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    imagesTable = process.env.IMAGES_TABLE,
    bucketName = process.env.IMAGES_S3_BUCKET,
    urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)
  ) {
    this.documentClient = documentClient
    this.imagesTable = imagesTable
    this.bucketName = bucketName
    this.urlExpiration = urlExpiration
    this.dynamoDbClient = DynamoDBDocument.from(this.documentClient)
    this.s3Client = s3Client = new S3Client()
  }

  async createImage(todoId, newImage) {
    const timestamp = new Date().toISOString()
    const imageId = uuidv4()

    const newItem = {
      todoId,
      timestamp,
      imageId,
      imageUrl: `https://${this.bucketName}.s3.amazonaws.com/${imageId}`,
      ...newImage
    }

    try {
      await this.dynamoDbClient.put({
        TableName: imagesTable,
        Item: newItem,
      })
      logger.info(`Stored new image with id ${imageId}`, { newImage, imageId, bucketName: this.bucketNames })
      return newItem
    } catch (error) {
      logger.error(`Error while storing new image with id ${imageId} to s3 bucket ${this.bucketName}`, { imageId, bucketName: this.bucketName, error: error.message })
      throw error
    }

  }

  async getUploadUrl(imageId) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: imageId
      })
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: this.urlExpiration
      })
      logger.info(`Created signed url for image with id ${imageId}`, { url })
      return url
    } catch (error) {
      logger.error(`Error while creating signed url for image with id ${imageId}`, { imageId, error: error.message })
      throw error
    }
  }
}
