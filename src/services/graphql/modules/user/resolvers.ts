import { AppointmentProvider } from '../appointment/provider'
import { UserProvider } from './provider'
import { UserInterface } from './interfaces'
import { AppointmentInterface } from '../appointment/interfaces'
import { connectionFromArray } from 'graphql-relay'

export const resolvers = {
  Query: {
    user: async (_, args, { dynamoDB }): Promise<UserInterface> => {
      return UserProvider.getUser(args, dynamoDB)
    },
    users: async (_, args, { dynamoDB }): Promise<UserInterface[]> => {
      const users = await UserProvider.getUsers(args, dynamoDB)
      return {
        totalCount: users.length,
        ...connectionFromArray(users, args),
      }
    },
  },
  User: {
    appointments: async ({ email: userEmail }, args, { dynamoDB, injector }): Promise<AppointmentInterface> => {
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
    createUser: async (_, args, { dynamoDB }): Promise<UserInterface> => {
      return UserProvider.createUser(args, dynamoDB)
    },
  },
}
