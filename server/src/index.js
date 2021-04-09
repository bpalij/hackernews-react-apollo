const { PrismaClient } = require('@prisma/client');
const { ApolloServer } = require('apollo-server');
const fs = require('fs');
const path = require('path');

const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const User = require('./resolvers/User')
const Link = require('./resolvers/Link')

const Subscription = require('./resolvers/Subscription')

const Vote = require('./resolvers/Vote')

const { PubSub } = require('apollo-server')

const pubsub = new PubSub();

// idCount=1;

// // 1
// const typeDefs = `
//   type Query {
//     info: String!
//     feed: [Link!]!
//   }

//   type Mutation {
//     post(url: String!, description: String!): Link!
//   }

//   type Link {
//     id: ID!
//     description: String!
//     url: String!
//   }
// `

// 1
// let links = [{
//   id: 'link-0',
//   url: 'www.howtographql.com',
//   description: 'Fullstack tutorial for GraphQL'
// }]

// 2
// const resolvers = {
//   Query: {
//     info: () => 'This is the API of a Hackernews Clone',
//     // info: () => null,
//     // 2
//     feed: (parent, args, context, info) => {
//       return context.prisma.link.findMany();
//     },
//     // link: (parent, args) => {
//     //   return links.filter(x => x.id === args.id)[0];
//     // }
//   },
//   Mutation: {
//     post: (parent, args, context) => {
//       // const link ={
//       //   id: `link-${idCount++}`,
//       //   description: args.description,
//       //   url: args.url,
//       // }
//       // links.push(link);
//       // return link;
//       const newLink = context.prisma.link.create({
//         data: {
//           url: args.url,
//           description: args.description,
//         },
//       })
//       return newLink;
//     },
//     // updateLink: (parent, args) => {
//     //   const link = links.filter(x => x.id === args.id)[0];
//     //   if (link) {
//     //     if (args.url) {
//     //       link.url = args.url;
//     //     }
//     //     if (args.description) {
//     //       link.description = args.description;
//     //     }
//     //     return link;
//     //   }
//     // },
//     // deleteLink: (parent, args) => {
//     //   const link = links.filter(x => x.id === args.id)[0];
//     //   if (link) {
//     //     const tempLink = {...link};
//     //     links = links.filter(x => x.id !== args.id);
//     //     return tempLink;
//     //   }
//     // }
//   },
//   // Link: {
//   //   id: (parent) => parent.id,
//   //   description: (parent) => parent.description,
//   //   url: (parent) => parent.url,
//   // }
// }

const resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
}

const prisma = new PrismaClient();

// 3
// const server = new ApolloServer({
//   typeDefs: fs.readFileSync(
//     path.join(__dirname, 'schema.graphql'),
//     'utf8'
//   ),
//   resolvers,
//   context: {
//     prisma
//   }
// })


const { getUserId } = require('./utils');

const server = new ApolloServer({
  typeDefs: fs.readFileSync(
    path.join(__dirname, 'schema.graphql'),
    'utf8'
  ),
  resolvers,
  context: ({ req }) => {
    return {
      ...req,
      prisma,
      pubsub,
      userId:
        req && req.headers.authorization
          ? getUserId(req)
          : null
    };
  }
});

server
  .listen()
  .then(({ url }) => {
    console.log(`Server is running on ${url}`);
  })

