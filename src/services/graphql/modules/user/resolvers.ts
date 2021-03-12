import { AppointmentProvider } from '../appointment/provider'
import { UserProvider } from './provider'
import { UserInterface, UserCreationInterface } from './interfaces'
import { AppointmentInterface } from '../appointment/interfaces'
import { connectionFromArray } from 'graphql-relay'

export const resolvers = {
  Query: {
    user: async (_, args): Promise<UserInterface> => {
      return UserProvider.getUser(args)
    },
    users: async (_, args): Promise<UserInterface[]> => {
      const users = await UserProvider.getUsers(args)
      return {
        totalCount: users.length,
        ...connectionFromArray(users, args),
      }
    },
  },
  User: {
    appointments: async ({ email: userEmail }, args): Promise<AppointmentInterface> => {
      const appointments: AppointmentInterface[] = await AppointmentProvider.getAppointmentByUserEmail(userEmail, args)

      return {
        totalCount: appointments.length,
        ...connectionFromArray(appointments, args),
      }
    },
  },
  Mutation: {
    createUser: async (_, args): Promise<UserCreationInterface> => {
      return UserProvider.createUser(args)
    },
  },
}
