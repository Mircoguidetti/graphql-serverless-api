import { Injectable } from 'graphql-modules'
import { UserInterface } from './interfaces'
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

  async createUser(user, dynamoDB): Promise<UserInterface> {
    const params = {
      TableName: this.tableName,
      Item: { ...user },
    }
    // Create user
    await dynamoDB.put(params).promise()
    return user
  }
}
