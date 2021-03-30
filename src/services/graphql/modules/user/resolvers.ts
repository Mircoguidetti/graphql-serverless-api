import { AppointmentProvider } from '../appointment/provider'
import { UserProvider } from './provider'
import { UserInterface } from './interfaces'
import { AppointmentInterface } from '../appointment/interfaces'
import { connectionFromArray } from 'graphql-relay'

export const resolvers = {
  Query: {
    user: async (_, args, { dynamoDB, injector }): Promise<UserInterface> => {
      return injector.get(UserProvider).getUser(args, dynamoDB)
    },
    users: async (_, args, { dynamoDB, injector }) => {
      const users = await injector.get(UserProvider).getUsers(args, dynamoDB)
      return {
        totalCount: users.length,
        ...connectionFromArray(users, args),
      }
    },
  },
  User: {
    appointments: async ({ email: userEmail }, args, { dynamoDB, injector }) => {
      const appointments: AppointmentInterface[] = await injector
        .get(AppointmentProvider)
        .getAppointmentByUserEmail(userEmail, args, dynamoDB)

      return {
        totalCount: appointments.length,
        ...connectionFromArray(appointments, args),
      }
    },
  },
  Mutation: {
    createUser: async (_, args, { dynamoDB, injector }): Promise<UserInterface> => {
      return injector.get(UserProvider).createUser(args, dynamoDB)
    },
  },
}
