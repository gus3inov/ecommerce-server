import {
  Prisma
} from 'prisma-binding';
import * as express from "express";
import {
  ApolloServer,
  makeExecutableSchema,
  gql
} from "apollo-server-express";
import resolvers from './resolvers';
import {
  importSchema
} from 'graphql-import';
import { graphqlUploadExpress } from 'graphql-upload'

const typeDefs: any = importSchema('./src/schema.graphql');
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const server = new ApolloServer({
  schema,
  uploads: false,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: './src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/muslim-guseinov-4235e0/ecommerce/ecommerce-dev',
      debug: true,
      secret: 'mysecret123',
    }),
  }),
})

const app = express();

app.use(graphqlUploadExpress({
  maxFileSize: 10000000,
  maxFiles: 20,
}))

server.applyMiddleware({
  app
});

app.listen({
    port: 4000
  }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)