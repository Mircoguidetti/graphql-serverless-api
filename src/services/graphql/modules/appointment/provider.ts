import { AppointmentInterface } from './interfaces'
import { DentistProvider } from '../dentist/provider'
import { UserProvider } from '../user/provider'
import { checkDateFormat } from '../../utils/date'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { UserInputError } from 'apollo-server-lambda'

export class AppointmentProvider {
  private static tableName = 'appointments'

  private static async getAppointmentsByDentistAndDateRange(
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

  static async getAppointmentByUserEmail(userEmail, { first }, dynamoDB): Promise<AppointmentInterface[]> {
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

  static async getAppointmentByDentistEmail(dentistEmail, { first }, dynamoDB): Promise<AppointmentInterface[]> {
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

  static async createAppointment(
    { userEmail, dentistEmail, startTime, endTime },
    dynamoDB
  ): Promise<AppointmentInterface> {
    const momentStartTime = moment(startTime, 'YYYY-MM-DD hh:mm')
    const momentEndTime = moment(endTime, 'YYYY-MM-DD hh:mm')

    if (!checkDateFormat(startTime) || !checkDateFormat(endTime)) {
      throw new UserInputError('Invalid date format (YYYY-MM-DD hh:mm)')
    }

    // Get user and check if exist
    const user = await UserProvider.getUser({ email: userEmail }, dynamoDB)
    if (!user) throw new UserInputError('User not found!')

    // Get dentist and check if exist
    const dentist = await DentistProvider.getDentist({ email: dentistEmail }, dynamoDB)
    if (!dentist) throw new UserInputError('Dentist not found!')

    // Check date format to book an appointment
    const appointmentDuration = momentEndTime.diff(momentStartTime, 'minutes')
    const appointmentStartTimeDiffNow = momentStartTime.diff(moment(), 'minutes')
    const appointmentEndTimeDiffNow = momentEndTime.diff(moment(), 'minutes')
    if (appointmentStartTimeDiffNow < 0 || appointmentEndTimeDiffNow < 0) {
      throw new UserInputError('Appointment (start on end) must be in the future!')
    }
    if (appointmentDuration > 60 || appointmentDuration <= 0) {
      throw new UserInputError('Appointment duration must be less then 1hour!')
    }

    // Get dentist appointments and check space
    const dentistAppointments = await this.getAppointmentsByDentistAndDateRange(
      {
        dentistEmail: dentistEmail,
        endTime: momentEndTime.unix(),
        startTime: momentStartTime.unix(),
      },
      dynamoDB
    )
    if (dentistAppointments.length > 0) {
      throw new UserInputError('No space between these two dates!')
    }
    const item = {
      id: uuidv4(),
      userEmail,
      dentistEmail,
      createdAt: moment().unix(),
      startTime: momentStartTime.unix(),
      endTime: momentEndTime.unix(),
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
