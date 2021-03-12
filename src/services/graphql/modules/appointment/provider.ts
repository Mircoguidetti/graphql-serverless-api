import { dynamoDB } from '../../../dynamodb/client'
import { AppointmentInterface, AppointmentBookingInterface } from './interfaces'
import { DentistProvider } from '../dentist/provider'
import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import { UserProvider } from '../user/provider'
import { checkDateFormat } from '../../utils'

export class AppointmentProvider {
  private static tableName: string = 'appointments'

  private static async getAppointmentsByDentistAndDateRange({
    dentistEmail,
    startTime,
    endTime,
  }): Promise<AppointmentInterface[]> {
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

  static async getAppointmentByUserEmail(userEmail, { first }): Promise<AppointmentInterface[]> {
    const params = {
      TableName: this.tableName,
      Limit: first,
      KeyConditionExpression: `userEmail = ${userEmail}`,
    }

    const { Items } = await dynamoDB.scan(params).promise()

    return Items
  }

  static async getAppointmentByDentistEmail(dentistEmail, { first }): Promise<AppointmentInterface[]> {
    const params = {
      TableName: this.tableName,
      Limit: first,
      KeyConditionExpression: `dentistEmail = ${dentistEmail}`,
    }

    const { Items } = await dynamoDB.scan(params).promise()

    return Items
  }

  static async createAppointment({
    userEmail,
    dentistEmail,
    startTime,
    endTime,
  }): Promise<AppointmentBookingInterface> {
    const momentStartTime = moment(startTime)
    const momentEndTime = moment(endTime)

    if (!checkDateFormat(startTime) || !checkDateFormat(endTime)) {
      return { message: 'Invalid date format (YYYY-MM-DD hh:mm)', isBooked: false }
    }

    // Get user and check if exist
    const user = await UserProvider.getUser({ email: userEmail })
    if (!user) return { message: 'User not found!', isBooked: false }

    // Get dentist and check if exist
    const dentist = await DentistProvider.getDentist({ email: dentistEmail })
    if (!dentist) return { message: 'Dentist not found!', isBooked: false }

    // Check date format to book an appointment
    const appointmentDuration = momentEndTime.diff(momentStartTime, 'minutes')

    if (appointmentDuration > 60 || appointmentDuration <= 0) {
      return {
        message: 'Appointment duration must be less then 1hour!',
        isBooked: false,
      }
    }

    // Get dentist appointments and check space
    const dentistAppointments = await this.getAppointmentsByDentistAndDateRange({
      dentistEmail,
      endTime: momentEndTime.unix(),
      startTime: momentStartTime.unix(),
    })
    if (dentistAppointments.length > 0) {
      return { message: 'No space between these two dates!', isBooked: false }
    }

    // Book appointment
    const params = {
      TableName: this.tableName,
      Item: {
        id: uuidv4(),
        userEmail,
        dentistEmail,
        createdAt: moment().unix(),
        startTime: momentStartTime.unix(),
        endTime: momentEndTime.unix(),
      },
    }
    try {
      await dynamoDB.put(params).promise()
      return { message: 'Appointment booked!', isBooked: true }
    } catch (error) {
      console.log('Error: ', error)
      return { message: error.message, isBooked: false }
    }
  }
}
