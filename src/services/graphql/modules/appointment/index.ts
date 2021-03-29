import { gql } from 'apollo-server-lambda'
import { resolvers } from './resolvers'

export const appointmentModule = {
  resolvers,
  typeDefs: gql`
    type Appointment {
      id: String!
      createdAt: String!
      startTime: String!
      endTime: String!
      userEmail: String!
      dentistEmail: String!
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
      createAppointment(userEmail: String!, dentistEmail: String!, startTime: String!, endTime: String!): Appointment!
    }
  `,
}
