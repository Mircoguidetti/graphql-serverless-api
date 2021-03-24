import createServer from '../services/graphql'

const server = createServer()

exports.handler = server.createHandler({
  cors: { origin: '*' },
})
