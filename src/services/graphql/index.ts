import 'reflect-metadata'
import { ApolloServer, ApolloError } from 'apollo-server-lambda'
import depthLimit from 'graphql-depth-limit'
import schema from './modules'
import { GraphQLFormattedError } from 'graphql'
import { dynamoDB } from './dynamodb/client'

export default new ApolloServer({
  schema,
  validationRules: [depthLimit(15)],
  formatError: (err): GraphQLFormattedError<Record<string, unknown>> => {
    console.log('ERROR', err)
    // Don't give the specific errors to the client.
    if (err.extensions?.code === 'INTERNAL_SERVER_ERROR' && !process.env.IS_OFFLINE) {
      return new ApolloError('Internal server error')
    }
    return err
  },

  context: async (integrationContext): Promise<Record<string, unknown>> => {
    return {
      dynamoDB,
      ...integrationContext,
    }
  },
})
