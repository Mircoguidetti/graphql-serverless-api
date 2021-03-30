import 'reflect-metadata'
import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing'
import { ApolloServer } from 'apollo-server-lambda'
import schema from '../modules'

export const createTestServer = (mocks): ApolloServerTestClient => {
  const server = new ApolloServer({ mocks, schema })
  return createTestClient(server)
}

export const createMockArray = (mock, fakerNumber: number) => {
  return { edges: Array.from({ length: fakerNumber }, () => ({ node: mock })) }
}
