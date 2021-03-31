import { Injectable } from 'graphql-modules'
import { DentistInterface } from './interfaces'

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

  async createDentist(dentist, dynamoDB): Promise<DentistInterface> {
    const params = {
      TableName: this.tableName,
      Item: {
        ...dentist,
      },
    }

    // Create dentist
    await dynamoDB.put(params).promise()
    return dentist
  }
}
