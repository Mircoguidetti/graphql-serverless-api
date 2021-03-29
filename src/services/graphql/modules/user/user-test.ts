import { createTestServer, createMockArray } from '../../utils/tests'
import faker from 'faker'

export const mockUser = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
}

describe('User queries', () => {
  test('Get single user', async () => {
    const mockResolvers = {
      Query: () => ({
        user: () => mockUser,
      }),
    }

    const { query } = createTestServer(mockResolvers)

    // graphl query
    const GET_USER = `
      query User($email:String!){
        user(email: $email){
          email
          firstName
          lastName
        }
      }
    `
    const response = await query({ query: GET_USER, variables: { email: mockUser.email } })
    expect(response.errors).toBe(undefined)
    expect(response.data.user).toEqual(mockUser)
  })

  test('Get list of users', async () => {
    const mockResolvers = {
      Query: () => ({
        users: () => createMockArray(mockUser, 10),
      }),
    }
    const { query } = createTestServer(mockResolvers)
    // graphl query
    const GET_USERS = `
      query users {
        users(first: 10) {
          edges {
            node {
              email
            }
          }
        }
      }
    `
    const response = await query({ query: GET_USERS })
    const edges = response.data.users.edges

    expect(response.errors).toBe(undefined)
    expect(edges.length).toEqual(10)
    expect(Array.isArray(edges)).toBe(true)
  })
})
