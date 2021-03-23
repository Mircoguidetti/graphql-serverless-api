import { AppointmentProvider } from '../appointment/provider'
import { AppointmentInterface } from '../appointment/interfaces'
import { DentistProvider } from './provider'
import { DentistInterface } from './interfaces'
import { connectionFromArray } from 'graphql-relay'

export const resolvers = {
  Query: {
    dentist: async (_, args, { dynamoDB }): Promise<DentistInterface> => {
      return DentistProvider.getDentist(args, dynamoDB)
    },
    dentists: async (_, args, { dynamoDB }): Promise<DentistInterface> => {
      const dentists = await DentistProvider.getDentists(args, dynamoDB)
      return {
        totalCount: dentists.length,
        ...connectionFromArray(dentists, args),
      }
    },
  },

  Dentist: {
    appointments: async ({ email: dentistEmail }, args, { dynamoDB }): Promise<AppointmentInterface> => {
      const appointments: AppointmentInterface[] = await AppointmentProvider.getAppointmentByDentistEmail(
        dentistEmail,
        args,
        dynamoDB
      )

      return {
        totalCount: appointments.length,
        ...connectionFromArray(appointments, args),
      }
    },
  },
  Mutation: {
    createDentist: async (_, args, { dynamoDB }): Promise<DentistInterface> => {
      return DentistProvider.createDentist(args, dynamoDB)
    },
  },
}
