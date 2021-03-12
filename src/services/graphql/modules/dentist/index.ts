import { gql } from 'apollo-server-lambda'
import { resolvers } from './resolvers'

export const dentistModule = {
  resolvers,
  typeDefs: gql`
    type Dentist {
      id: Int!
      firstName: String
      lastName: String
      email: String
      appointments(first: Int!, after: String): AppointmentConnection!
    }

    type DentistCreation {
      isCreated: Boolean!
      message: String!
    }

    type DentistConnection {
      totalCount: Int!
      pageInfo: PageInfo
      edges: [DentistEdge!]!
    }

    type DentistEdge {
      node: User!
    }

    extend type Query {
      dentist(email: String!): Dentist
      dentists(first: Int!, after: String): DentistConnection!
    }
    extend type Mutation {
      createDentist(email: String!, firstName: String!, lastName: String!): DentistCreation!
    }
  `,
}
