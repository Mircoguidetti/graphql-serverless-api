import deepmerge from 'deepmerge'
import { gql } from 'apollo-server-lambda'
import { makeExecutableSchema } from 'graphql-tools'
import moment from 'moment'

export const makeExecutableFromModules = (modules): any => {
  const globalTypeDefs = gql`
    type Query
    type Mutation
    type PageInfo {
      startCursor: String!
      endCursor: String!
      hasPreviousPage: Boolean!
      hasNextPage: Boolean!
    }
  `

  let typeDefs = [globalTypeDefs]

  let resolvers = {}

  modules.forEach((module) => {
    typeDefs = [...typeDefs, ...module.typeDefs]

    resolvers = deepmerge(resolvers, module.resolvers)
  })
  let schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  })

  return schema
}

export const checkDateFormat = (date) => {
  return moment(date, 'YYYY-MM-DD hh:mm', true).isValid()
}
