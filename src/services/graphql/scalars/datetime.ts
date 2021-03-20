import { GraphQLScalarType, Kind } from 'graphql'
import { gql } from 'apollo-server-lambda'
import moment from 'moment'

const typeDef = gql`
  scalar DateTime
`

const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'A DateTime representation in ISO format',
  serialize(value: number): string {
    return moment(value).format('YYYY-MM-DD hh:mm')
  },
})

export default {
  typeDef,
  resolvers: {
    DateTime,
  },
}
