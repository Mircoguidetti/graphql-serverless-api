import { gql } from 'apollo-server-lambda'

export const commonModule = {
  typeDefs: gql`
    type Query
    type Mutation
    type PageInfo {
      startCursor: String!
      endCursor: String!
      hasPreviousPage: Boolean!
      hasNextPage: Boolean!
    }
  `,
}
