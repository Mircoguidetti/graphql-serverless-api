import DateTime from './datetime'

export default {
  typeDefs: [DateTime.typeDef],
  resolvers: {
    ...DateTime.resolvers,
  },
}
