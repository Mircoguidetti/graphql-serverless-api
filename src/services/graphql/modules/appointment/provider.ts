import { Injectable } from 'graphql-modules'
import { AppointmentInterface } from './interfaces'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { UserInputError } from 'apollo-server-lambda'

@Injectable()
export class AppointmentProvider {
  private tableName = 'appointments'

  async getAppointmentsByDentistAndDateRange(
    { dentistEmail, startTime, endTime },
    dynamoDB
  ): Promise<AppointmentInterface[]> {
    const params = {
      TableName: this.tableName,
      ExpressionAttributeNames: {
        '#dentistEmail': 'dentistEmail',
        '#startTime': 'startTime',
        '#endTime': 'endTime',
      },
      ExpressionAttributeValues: {
        ':dentistEmail': dentistEmail,
        ':startTime': startTime,
        ':endTime': endTime,
      },
      FilterExpression: '#startTime < :endTime AND #endTime > :startTime AND #dentistEmail = :dentistEmail',
    }

    const { Items } = await dynamoDB.scan(params).promise()

    return Items
  }

  async getAppointmentByUserEmail(userEmail, { first }, dynamoDB): Promise<AppointmentInterface[]> {
    const params = {
      TableName: this.tableName,
      Limit: first,
      ExpressionAttributeNames: {
        '#userEmail': 'userEmail',
      },

      ExpressionAttributeValues: {
        ':userEmail': userEmail,
      },
      FilterExpression: '#userEmail = :userEmail',
    }

    const { Items } = await dynamoDB.scan(params).promise()

    return Items
  }

  async getAppointmentByDentistEmail(dentistEmail, { first }, dynamoDB): Promise<AppointmentInterface[]> {
    const params = {
      TableName: this.tableName,
      Limit: first,
      ExpressionAttributeNames: {
        '#dentistEmail': 'dentistEmail',
      },

      ExpressionAttributeValues: {
        ':dentistEmail': dentistEmail,
      },
      FilterExpression: '#dentistEmail = :dentistEmail',
    }

    const { Items } = await dynamoDB.scan(params).promise()

    return Items
  }

  async createAppointment({ userEmail, dentistEmail, startTime, endTime }, dynamoDB): Promise<AppointmentInterface> {
    const momentStartTimeUnix = moment(startTime, 'YYYY-MM-DD hh:mm').unix()
    const momentEndTimeUnix = moment(endTime, 'YYYY-MM-DD hh:mm').unix()

    const item = {
      id: uuidv4(),
      userEmail,
      dentistEmail,
      createdAt: moment().unix(),
      startTime: momentStartTimeUnix,
      endTime: momentEndTimeUnix,
    }
    // Book appointment
    const params = {
      TableName: this.tableName,
      Item: {
        ...item,
      },
    }
    try {
      await dynamoDB.put(params).promise()
      return item
    } catch (error) {
      console.log('Error: ', error)
      throw new UserInputError(error.message)
    }
  }
}
