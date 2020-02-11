
import express from 'express';
import fs from 'fs';
import https from 'https';
import http from 'http';
import Cookies from 'cookies';

import jwt from'jsonwebtoken';
import ApolloClient from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { makeExecutableSchema, addSchemaLevelResolveFunction } from 'apollo-server';
import { importSchema } from 'graphql-import';
import depthLimit from 'graphql-depth-limit';
import { ApolloServer } from 'apollo-server-express';
import { GraphQLScalarType, Kind } from 'graphql';
import gql from 'graphql-tag';

import fetch from 'node-fetch';
global.fetch = fetch
global.window = global
global.Headers = fetch.Headers
global.Request = fetch.Request
global.Response = fetch.Response
global.location = { hostname: '' }

import DB from './api/DB.js';
import Resolvers from './api/resolvers.js';

const configurations = {
  api: { ssl: false, port: 4000, hostname: 'localhost' },
  www: { ssl: false, port: 8080, hostname: 'localhost' }
};

var app = express();

/* Apollo server */

const db = new DB();
const resolvers = new Resolvers(db);
const typeDefs = importSchema('./api/schema.graphql')
const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers.resolvers,
    inheritResolversFromInterfaces: true
});
const apollo = new ApolloServer({ schema, playground: true, validationRules: [depthLimit(5)] })
apollo.applyMiddleware({ app });
var server = http.createServer(app)

apollo.installSubscriptionHandlers(server);
server.listen({ port: configurations['api'].port }, () =>
    console.log('API launched on port '+configurations['api'].port)
);

const client = new ApolloClient({
  uri: `http${configurations['api'].ssl ? 's' : ''}://${configurations['api'].hostname}:${configurations['api'].port}${apollo.graphqlPath}`
});


/* Web server */
app.set('view engine', 'pug');

app.use('/styles',express.static('dist/styles'));
app.use('/icons',express.static('dist/icons'));
app.use('/js',express.static('dist/js'));

app.get('/', function (req, res) {
  var memory = {};
  res.render('index', memory);
});

app.get('/publishers/', function (req, res) {
  var memory = {};
  getPublishers().then(publishers => {
    memory.publishers = publishers
    getBooks().then(books => {
      memory.books = books;
      res.render('publishers', memory);
    })
  })
});

app.get('/authors/', function (req, res) {
  var memory = {};
  getAuthors().then(authors => {
    memory.authors = authors
    getBooks().then(books => {
      memory.books = books;
      
      res.render('authors', memory);
    })
  })
});

app.get('/libraries/', function (req, res) {
  var memory = {};
  getLibraries().then(libraries => {
    memory.libraries = libraries;
    getBooks().then(books => {
      memory.books = books;

      res.render('libraries', memory);
    })
  })
});

app.get('/clients/', function (req, res) {
  var memory = {};
  getClients().then(clients => {
    memory.clients = clients

    res.render('clients', memory);
  })
});

app.get('/books/', function (req, res) {
  var memory = {};
  getClients().then(clients => {
    memory.clients = clients
    getAuthors().then(authors => {
      memory.authors = authors
      getPublishers().then(publishers => {
        memory.publishers = publishers
        getLibraries().then(libraries => {
          memory.libraries = libraries
          getBooks().then(books => {
            memory.books = books
      
            res.render('books', memory);
          })
        })
      })
    })
  })
});




app.listen(configurations['www'].port, () =>{
  console.log('Website launched on port ' + configurations['www'].port);
});




async function getClients() {
  var REQUEST = gql`
  query{
    clients{
      ID
      name
      phone
      email
    }
  }
  `;


  return new Promise(function(resolve, reject) {
    client.mutate({
      mutation: REQUEST
    })
      .then(data => {
        resolve(data.data.clients);
      })
      .catch(error => reject(error));
  });
}


async function getBooks() {
  var REQUEST = gql`
  query{
    books{
      ID
      status
      name
      date
      _ownerID
      publisher{
        ID
        name
      }
      author{
        ID
        name
      }
      library{
        ID
        address
      }
    }
  }
  `;


  return new Promise(function(resolve, reject) {
    client.mutate({
      mutation: REQUEST
    })
      .then(data => {
        resolve(data.data.books);
      })
      .catch(error => reject(error));
  });
}

async function getAuthors() {
  var REQUEST = gql`
  query{
    authors{
      ID
      name
      birth
    }
  }
  `;


  return new Promise(function(resolve, reject) {
    client.mutate({
      mutation: REQUEST
    })
      .then(data => {
        resolve(data.data.authors);
      })
      .catch(error => reject(error));
  });
}

async function getLibraries() {
  var REQUEST = gql`
  query{
    libraries{
      ID
      address
      phone
      email
    }
  }
  `;


  return new Promise(function(resolve, reject) {
    client.mutate({
      mutation: REQUEST
    })
      .then(data => {
        resolve(data.data.libraries);
      })
      .catch(error => reject(error));
  });
}

async function getPublishers() {
  var REQUEST = gql`
  query{
    publishers{
      ID
      name
      address
    }
  }
  `;


  return new Promise(function(resolve, reject) {
    client.mutate({
      mutation: REQUEST
    })
      .then(data => {
        resolve(data.data.publishers);
      })
      .catch(error => reject(error));
  });
}