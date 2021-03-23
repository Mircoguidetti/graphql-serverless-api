import { AppointmentProvider } from './provider'
import { AppointmentInterface } from './interfaces'
export const resolvers = {
  Mutation: {
    createAppointment: async (_, args, { dynamoDB }): Promise<AppointmentInterface> => {
      return AppointmentProvider.createAppointment(args, dynamoDB)
    },
  },
}
