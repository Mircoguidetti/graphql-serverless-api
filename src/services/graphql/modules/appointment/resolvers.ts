import { AppointmentProvider } from './provider'
import { AppointmentBookingInterface } from './interfaces'

export const resolvers = {
  Mutation: {
    createAppointment: async (_, args): Promise<AppointmentBookingInterface> => {
      return AppointmentProvider.createAppointment(args)
    },
  },
}
