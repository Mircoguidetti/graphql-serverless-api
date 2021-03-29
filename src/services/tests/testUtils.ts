import { createTestClient, ApolloServerTestClient } from 'apollo-server-testing'
import { ApolloServer } from 'apollo-server-lambda'
import modules from '../graphql/modules'

export const createTestServer = (mocks): ApolloServerTestClient => {
  return createTestClient(new ApolloServer({ mocks, modules }) as any)
}

export const createMockArray = (mock, fakerNumber: number) => {
  return { edges: Array.from({ length: fakerNumber }, () => ({ node: mock })) }
}
