import { dynamoDB } from '../../../dynamodb/client'
import { DentistInterface, DentistCreationInterface } from './interfaces'
import validator from 'email-validator'

export class DentistProvider {
  private static tableName: string = 'dentists'

  static async getDentist({ email }): Promise<DentistInterface> {
    const params = {
      TableName: this.tableName,
      Key: { email },
    }

    const { Item } = await dynamoDB.get(params).promise()
    return Item
  }

  static async getDentists({ first }): Promise<DentistInterface[]> {
    const params = {
      TableName: this.tableName,
      Limit: first,
    }

    const { Items } = await dynamoDB.scan(params).promise()
    return Items
  }

  static async createDentist({ email, firstName, lastName }): Promise<DentistCreationInterface> {
    // Check if email is valid
    if (!validator.validate(email)) return { message: 'Dentist Email not valid!', isCreated: false }
    const params = {
      TableName: this.tableName,
      Item: {
        email,
        firstName,
        lastName,
      },
    }

    // Create dentist
    try {
      await dynamoDB.put(params).promise()
      return { message: 'Dentist Created!', isCreated: true }
    } catch (error) {
      console.log('Error: ', error)
      return { message: error.message, isCreated: false }
    }
  }
}
