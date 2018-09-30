import { Prisma } from 'prisma-binding';
import * as express from "express";
import { ApolloServer, makeExecutableSchema, gql } from "apollo-server";
import resolvers from './resolvers';
import { importSchema } from 'graphql-import';

const typeDefs: any = importSchema('./src/schema.graphql');
const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
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

server.listen().then(() => console.log('Server is running on http://localhost:4000'))
