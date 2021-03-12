import { ApolloServer } from 'apollo-server-lambda'
import depthLimit from 'graphql-depth-limit'
import { makeExecutableFromModules } from './utils'
import modules from './modules'
import { GraphQLFormattedError } from 'graphql'

export default new ApolloServer({
  validationRules: [depthLimit(15)],
  formatError: (err): GraphQLFormattedError<Record<string, unknown>> => {
    console.log('ERROR', err)
    // Don't give the specific errors to the client.
    if (err.extensions?.code === 'INTERNAL_SERVER_ERROR' && !process.env.IS_OFFLINE) {
      return new Error('Internal server error')
    }
    return err
  },

  schema: makeExecutableFromModules(modules),
})
