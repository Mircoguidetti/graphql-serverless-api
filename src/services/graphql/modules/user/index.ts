import { createModule, gql } from 'graphql-modules'
import { resolvers } from './resolvers'
import { UserProvider } from './provider'

export const UserModule = createModule({
  id: 'user',
  dirname: __dirname,
  providers: [UserProvider],
  resolvers,
  typeDefs: gql`
    type User {
      firstName: String
      lastName: String
      email: String
      appointments(first: Int!, after: String): AppointmentConnection!
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
      createUser(email: String!, firstName: String!, lastName: String!): User!
    }
  `,
})
