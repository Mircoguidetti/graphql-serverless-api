import { gql } from 'apollo-server-lambda'
import { resolvers } from './resolvers'

export const appointmentModule = {
  resolvers,
  typeDefs: gql`
    type Appointment {
      id: String!
      createdAt: Int
      startTime: Int
      endTime: Int
    }

    type AppointmentBooking {
      isBooked: Boolean!
      message: String!
    }
    type AppointmentConnection {
      totalCount: Int!
      pageInfo: PageInfo
      edges: [AppointmentEdge!]!
    }

    type AppointmentEdge {
      node: Appointment!
    }

    extend type Mutation {
      createAppointment(
        userEmail: String!
        dentistEmail: String!
        startTime: String!
        endTime: String!
      ): AppointmentBooking!
    }
  `,
}
