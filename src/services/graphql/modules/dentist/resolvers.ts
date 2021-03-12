import { AppointmentProvider } from '../appointment/provider'
import { AppointmentInterface } from '../appointment/interfaces'
import { DentistProvider } from './provider'
import { DentistInterface, DentistCreationInterface } from './interfaces'
import { connectionFromArray } from 'graphql-relay'

export const resolvers = {
  Query: {
    dentist: async (_, args): Promise<DentistInterface> => {
      return DentistProvider.getDentist(args)
    },
    dentists: async (_, args): Promise<DentistInterface> => {
      const dentists = await DentistProvider.getDentists(args)
      return {
        totalCount: dentists.length,
        ...connectionFromArray(dentists, args),
      }
    },
  },

  Dentist: {
    appointments: async ({ email: dentistEmail }, args): Promise<AppointmentInterface> => {
      const appointments: AppointmentInterface[] = await AppointmentProvider.getAppointmentByDentistEmail(
        dentistEmail,
        args
      )

      return {
        totalCount: appointments.length,
        ...connectionFromArray(appointments, args),
      }
    },
  },
  Mutation: {
    createDentist: async (_, args): Promise<DentistCreationInterface> => {
      return DentistProvider.createDentist(args)
    },
  },
}
