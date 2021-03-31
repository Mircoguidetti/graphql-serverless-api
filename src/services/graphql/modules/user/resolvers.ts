import validator from 'email-validator'
import { connectionFromArray } from 'graphql-relay'
import { UserInputError } from 'apollo-server-lambda'
import { AppointmentProvider } from '../appointment/provider'
import { UserProvider } from './provider'
import { UserInterface } from './interfaces'
import { AppointmentInterface } from '../appointment/interfaces'

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
      // Check if email is valid
      if (!validator.validate(args.email)) throw new UserInputError('User email is not valid!')

      // Check if user already exists
      const user = await injector.get(UserProvider).getUser({ email: args.email }, dynamoDB)
      if (user) throw new UserInputError('User already exist!')

      // Create user
      return injector.get(UserProvider).createUser(args, dynamoDB)
    },
  },
}
