import { dynamoDB } from '../../../dynamodb/client'
import { UserInterface, UserCreationInterface } from './interfaces'
import validator from 'email-validator'
export class UserProvider {
  private static tableName: string = 'users'

  static async getUser({ email }): Promise<UserInterface> {
    const params = {
      TableName: this.tableName,
      Key: { email },
    }

    const { Item } = await dynamoDB.get(params).promise()
    return Item
  }

  static async getUsers({ first }): Promise<UserInterface[]> {
    const params = {
      TableName: this.tableName,
      Limit: first,
    }

    const { Items } = await dynamoDB.scan(params).promise()
    return Items
  }

  static async createUser({ email, firstName, lastName }): Promise<UserCreationInterface> {
    // Check if email is valid
    if (!validator.validate(email)) return { message: 'User Email not valid!', isCreated: false }
    const params = {
      TableName: this.tableName,
      Item: {
        email,
        firstName,
        lastName,
      },
    }
    // Create user
    try {
      await dynamoDB.put(params).promise()
      return { message: 'User Created!', isCreated: true }
    } catch (error) {
      console.log('Error: ', error)
      return { message: error.message, isCreated: false }
    }
  }
}
