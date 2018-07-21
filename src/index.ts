import { Prisma } from 'prisma-binding';
import * as express from "express";
import { GraphQLServer } from "graphql-yoga";
import resolvers from './resolvers';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: './src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/muslim-guseinov-4235e0/ecommerce/ecommerce-dev', // the endpoint of the Prisma API
      debug: true, // log all GraphQL queries & mutations sent to the Prisma API
      secret: 'mysecret123', // only needed if specified in `database/prisma.yml`
    }),
  }),
})

server.express.use("/images", express.static("images"));

server.start(() => console.log('Server is running on http://localhost:4000'))
