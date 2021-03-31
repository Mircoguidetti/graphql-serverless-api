import { createModule, gql } from 'graphql-modules'
import { resolvers } from './resolvers'
import { AppointmentProvider } from './provider'
import { UserProvider } from '../user/provider'
import { DentistProvider } from '../dentist/provider'

export const AppointmentModule = createModule({
  id: 'appointment',
  dirname: __dirname,
  providers: [AppointmentProvider, UserProvider, DentistProvider],
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
})
