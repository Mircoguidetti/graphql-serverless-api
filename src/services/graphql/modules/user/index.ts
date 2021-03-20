import { gql } from 'apollo-server-lambda'
import { resolvers } from './resolvers'

export const userModule = {
  resolvers,
  typeDefs: gql`
    type User {
      firstName: String
      lastName: String
      email: String
      appointments(first: Int!, after: String): AppointmentConnection!
    }

    type UserCreation {
      isCreated: Boolean!
      message: String!
    }

    type UserConnection {
      totalCount: Int!
      pageInfo: PageInfo
      edges: [UserEdge!]!
    }

    type UserEdge {
      node: User!
    }

    extend type Query {
      user(email: String!): User
      users(first: Int!, after: String): UserConnection!
    }

    extend type Mutation {
      createUser(email: String!, firstName: String!, lastName: String!): UserCreation!
    }
  `,
}
