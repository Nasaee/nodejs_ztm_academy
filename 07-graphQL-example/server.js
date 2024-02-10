const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');

// looking for .graphql files in directories or sub-directories
const typesArray = loadFilesSync('./**/*', {
  extensions: ['graphql'],
});
const resolversArray = loadFilesSync(path.join(__dirname, './**/*'), {
  extensions: ['.resolvers.js'],
});

async function startApolloServer() {
  const app = express();

  const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolversArray,
  });

  const server = new ApolloServer({
    schema: schema,
  });

  // prepare to handle incoming graphql operations whith apollo (connecting qraphql data)
  await server.start();
  //  when Apollo Server ready call following to connect to express
  server.applyMiddleware({ app, path: '/graphql' }); // you can replace '/graphql' with any thing you want

  app.listen(3000, () => console.log('Running GraphQL Server...'));
}

startApolloServer();
