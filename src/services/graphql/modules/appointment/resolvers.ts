import { AppointmentProvider } from './provider'
import { AppointmentInterface } from './interfaces'
export const resolvers = {
  Mutation: {
    createAppointment: async (_, args, { dynamoDB, injector }): Promise<AppointmentInterface> => {
      return injector.get(AppointmentProvider).createAppointment(args, dynamoDB)
    },
  },
}
