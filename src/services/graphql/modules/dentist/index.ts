import { createModule, gql } from 'graphql-modules'
import { resolvers } from './resolvers'
import { DentistProvider } from './provider'
import { AppointmentProvider } from '../appointment/provider'

export const DentistModule = createModule({
  id: 'dentist',
  dirname: __dirname,
  providers: [DentistProvider, AppointmentProvider],
  resolvers,
  typeDefs: gql`
    type Dentist {
      firstName: String
      lastName: String
      email: String
      appointments(first: Int!, after: String): AppointmentConnection!
    }

    type DentistConnection {
      totalCount: Int!
      pageInfo: PageInfo
      edges: [DentistEdge!]!
    }

    type DentistEdge {
      node: Dentist!
    }

    extend type Query {
      dentist(email: String!): Dentist
      dentists(first: Int!, after: String): DentistConnection!
    }
    extend type Mutation {
      createDentist(email: String!, firstName: String!, lastName: String!): Dentist!
    }
  `,
})
