import { createModule, gql } from 'graphql-modules'

export const CommonModule = createModule({
  id: 'common',
  dirname: __dirname,
  resolvers: {},
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
})
