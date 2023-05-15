import "reflect-metadata";
import express from "express";
import cookieParser from "cookie-parser";
import { buildSchema } from "type-graphql";
import { connectDatabase } from "./config/database";
import { serverPort } from "./config";
import eventLogger from "./services/eventLogger";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageProductionDefault,
} from "apollo-server-core";
import { resolvers } from "./resolvers/index.resolver";
import { initiateKafka } from "./utils/kafka.utils";

async function bootstrap() {

  const schema = await buildSchema({
    resolvers,
  });

  const app = express();

  app.use(cookieParser());

  const server = new ApolloServer({
    schema,
    formatError: (error) => ({
      message: error.message,
    }),
    context: (ctx) => {

      return ctx;
    },
    plugins: [
      process.env.NODE_ENV === "production"
        ? ApolloServerPluginLandingPageProductionDefault()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  await server.start();
  // apply middleware to server

  server.applyMiddleware({ app });


  connectDatabase()

  app.listen({ port: serverPort }, () => {
    eventLogger.logInfo("app listening on port" + serverPort);
  });
  await initiateKafka().catch(console.error);
}
bootstrap()