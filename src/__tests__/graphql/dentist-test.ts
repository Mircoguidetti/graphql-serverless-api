import { createTestServer } from '../testUtils'
import { mockDentist } from '../mock-data'
import { createMockArray } from '../testUtils'

describe('Dentist queries', () => {
  test('Get single dentist', async () => {
    const mocksResolvers = {
      Query: () => ({
        dentist: () => mockDentist,
      }),
    }

    const { query } = createTestServer(mocksResolvers)

    // graphl query
    const GET_DENTIST = `
      query Dentist($email:String!){
        dentist(email: $email){
          email
          firstName
          lastName
        }
      }
    `
    const response = await query({ query: GET_DENTIST, variables: { email: mockDentist.email } })
    expect(response.errors).toBe(undefined)
    expect(response.data.dentist).toEqual(mockDentist)
  })

  test('Get list of dentists', async () => {
    const mockDentists = createMockArray(mockDentist, 10)

    const mocksResolvers = {
      Query: () => ({
        dentists: () => mockDentists,
      }),
    }

    const { query } = createTestServer(mocksResolvers)

    // graphl query
    const GET_DENTISTS = `
      query dentists {
        dentists(first: 10) {
          edges {
            node {
              email
            }
          }
        }
      }
    `
    const response = await query({ query: GET_DENTISTS })
    const edges = response.data.dentists.edges

    expect(response.errors).toBe(undefined)
    expect(edges.length).toEqual(10)
    expect(Array.isArray(edges)).toBe(true)
  })
})
