import { Injectable } from 'graphql-modules'
import { UserInterface } from './interfaces'
import validator from 'email-validator'
import { UserInputError } from 'apollo-server-lambda'
@Injectable()
export class UserProvider {
  private tableName = 'users'

  async getUser({ email }, dynamoDB): Promise<UserInterface> {
    const params = {
      TableName: this.tableName,
      Key: { email },
    }

    const { Item } = await dynamoDB.get(params).promise()
    return Item
  }

  async getUsers({ first }, dynamoDB): Promise<UserInterface[]> {
    const params = {
      TableName: this.tableName,
      Limit: first,
    }

    const { Items } = await dynamoDB.scan(params).promise()
    return Items
  }

  async createUser(item, dynamoDB): Promise<UserInterface> {
    // Check if email is valid
    if (!validator.validate(item.email)) throw new UserInputError('User email is not valid!')

    const user = await this.getUser({ email: item.email }, dynamoDB)

    if (user) throw new UserInputError('User already exist!')

    const params = {
      TableName: this.tableName,
      Item: { ...item },
    }
    // Create user
    try {
      await dynamoDB.put(params).promise()
      return item
    } catch (error) {
      console.log('Error: ', error)
      throw new UserInputError(error.message)
    }
  }
}
