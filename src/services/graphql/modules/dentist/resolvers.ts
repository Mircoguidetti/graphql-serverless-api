import { connectionFromArray } from 'graphql-relay'
import validator from 'email-validator'
import { UserInputError } from 'apollo-server-lambda'
import { AppointmentProvider } from '../appointment/provider'
import { AppointmentInterface } from '../appointment/interfaces'
import { DentistProvider } from './provider'
import { DentistInterface } from './interfaces'

export const resolvers = {
  Query: {
    dentist: async (_, args, { dynamoDB, injector }): Promise<DentistInterface> => {
      return injector.get(DentistProvider).getDentist(args, dynamoDB)
    },
    dentists: async (_, args, { dynamoDB, injector }) => {
      const dentists = await injector.get(DentistProvider).getDentists(args, dynamoDB)
      return {
        totalCount: dentists.length,
        ...connectionFromArray(dentists, args),
      }
    },
  },

  Dentist: {
    appointments: async ({ email: dentistEmail }, args, { dynamoDB, injector }) => {
      const appointments: AppointmentInterface[] = await injector
        .get(AppointmentProvider)
        .getAppointmentByDentistEmail(dentistEmail, args, dynamoDB)

      return {
        totalCount: appointments.length,
        ...connectionFromArray(appointments, args),
      }
    },
  },
  Mutation: {
    createDentist: async (_, args, { dynamoDB, injector }): Promise<DentistInterface> => {
      // Check if email is valid
      if (!validator.validate(args.email)) throw new UserInputError('Dentist email not valid!')

      // Check if dentist already extist
      const dentist = await injector.get(DentistProvider).getDentist({ email: args.email }, dynamoDB)
      if (dentist) throw new UserInputError('Dentist already exist!')

      // Create dentist
      return injector.get(DentistProvider).createDentist(args, dynamoDB)
    },
  },
}
