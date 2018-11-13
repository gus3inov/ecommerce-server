import { GraphQLUpload } from 'graphql-upload'
import { Query } from './Query'
import { auth } from './Mutation/auth'
import { post } from './Mutation/post'
import { product } from './Mutation/product'
import { AuthPayload } from './AuthPayload'

export default {
  Upload: GraphQLUpload,
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...product,
  },
  AuthPayload,
}