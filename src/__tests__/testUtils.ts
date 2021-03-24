import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing'
import createServer from '../services/graphql'

export const createTestServer = (mocks): ApolloServerTestClient => {
  return createTestClient(createServer(mocks))
}

export const createMockArray = (mock, fakerNumber: number) => {
  return { edges: Array.from({ length: fakerNumber }, () => ({ node: mock })) }
}
