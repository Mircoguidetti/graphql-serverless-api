import { UserInputError } from 'apollo-server-lambda'
import { AppointmentProvider } from './provider'
import { AppointmentInterface } from './interfaces'
import { UserProvider } from '../user/provider'
import { DentistProvider } from '../dentist/provider'
import { validateAppointmentDate } from '../../helpers/date'

export const resolvers = {
  Mutation: {
    createAppointment: async (_, appointment, { dynamoDB, injector }): Promise<AppointmentInterface> => {
      // Validate date format
      const { startTime, endTime, userEmail, dentistEmail } = appointment

      const isDateFormatInvalid = validateAppointmentDate(startTime, endTime)
      if (isDateFormatInvalid) {
        throw new UserInputError(isDateFormatInvalid)
      }

      // Check if user exist
      const user = await injector.get(UserProvider).getUser({ email: userEmail }, dynamoDB)
      if (!user) throw new UserInputError('User not found!')

      // Get dentist and check if exist
      const dentist = await injector.get(DentistProvider).getDentist({ email: dentistEmail }, dynamoDB)
      if (!dentist) throw new UserInputError('Dentist not found!')

      // Check if appointment within date range
      const dentistAppointments = await injector
        .get(AppointmentProvider)
        .getAppointmentsByDentistAndDateRange(appointment, dynamoDB)

      if (dentistAppointments.length > 0) {
        throw new UserInputError('No space between these two dates!')
      }
      return injector.get(AppointmentProvider).createAppointment(appointment, dynamoDB)
      return appointment
    },
  },
}
