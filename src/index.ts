import { createServer } from "http";
import { Prisma } from "prisma-binding";
import * as express from "express";
import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import resolvers from "./resolvers";
import { importSchema } from "graphql-import";
import { graphqlUploadExpress } from "graphql-upload";

const PORT = 4000;
const typeDefs: any = importSchema("./src/schema.graphql");
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
      typeDefs: "./src/generated/prisma.graphql",
      endpoint:
        "https://eu1.prisma.sh/muslim-guseinov-4235e0/ecommerce/ecommerce-dev",
      debug: true,
      secret: "mysecret123"
    })
  })
});

const app = express();

app.use(
  graphqlUploadExpress({
    maxFileSize: 10000000,
    maxFiles: 20
  })
);

app.use("/images", express.static("images"));

server.applyMiddleware({
  app
});

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(
  {
    port: PORT
  },
  () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${PORT}${
        server.subscriptionsPath
      }`
    );
  }
);
