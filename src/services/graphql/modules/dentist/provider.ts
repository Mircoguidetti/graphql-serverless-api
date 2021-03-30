import { Injectable } from 'graphql-modules'
import { DentistInterface } from './interfaces'
import validator from 'email-validator'
import { UserInputError } from 'apollo-server-lambda'

@Injectable()
export class DentistProvider {
  private tableName = 'dentists'

  async getDentist({ email }, dynamoDB): Promise<DentistInterface> {
    const params = {
      TableName: this.tableName,
      Key: { email },
    }

    const { Item } = await dynamoDB.get(params).promise()
    return Item
  }

  async getDentists({ first }, dynamoDB): Promise<DentistInterface[]> {
    const params = {
      TableName: this.tableName,
      Limit: first,
    }

    const { Items } = await dynamoDB.scan(params).promise()
    return Items
  }

  async createDentist(item, dynamoDB): Promise<DentistInterface> {
    // Check if email is valid
    if (!validator.validate(item.email)) throw new UserInputError('Dentist email not valid!')

    const dentist = await this.getDentist({ email: item.email }, dynamoDB)
    if (dentist) throw new UserInputError('Dentist already exist!')

    const params = {
      TableName: this.tableName,
      Item: {
        ...item,
      },
    }

    // Create dentist
    try {
      await dynamoDB.put(params).promise()
      return item
    } catch (error) {
      console.log('Error: ', error)
      throw new UserInputError(error.message)
    }
  }
}
