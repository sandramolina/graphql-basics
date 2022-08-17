const { ApolloServer, gql } = require('apollo-server');
const { MockList } = require('@graphql-tools/mock');

//Schema creation
const typeDefs = gql`
  scalar Date

  """
  An schema is ALL about communication - so Documentation comes handy: An object that decribes the characteristics of a ski day
  """
  type SkiDay {
    id: ID!
    date: Date!
    "The location of the ski day"
    mountain: String!
    "This is an enum type"
    conditions: Conditions
  }

  enum Conditions {
    POWDER
    HEAVY
    ICE
    THIN
  }

  type Query {
    totalDays: Int!
    allDays: [SkiDay!]!
  }

  input AddDayInput {
    date: Date!
    mountain: String!
    conditions: Conditions
  }

  type RemoveDayPayload {
    day: SkiDay!
    removed: Boolean
    totalBefore: Int
    totalAfter: Int
  }

  type Mutation {
    addDay(input: AddDayInput!): SkiDay
    removeDay(id: ID!): RemoveDayPayload!
  }

  "Subscriptions are not working more info here: https://gist.github.com/ivanstnsk/a6c91c43e70c1d171c0d0500ef6a9493 and here: https://www.apollographql.com/docs/apollo-server/data/subscriptions/"
  type Subscription {
    newDay: SkiDay!
  }
`;

//Create your own mock values - function that returns a value for a date
const mocks = {
  Date: () => '1/2/2025',
  String: () => 'Cool data',

  Query: () => ({
    // You can use MockList([1, 15]) or MockList(8) to define the number of results you want in the query
    allDays: () => new MockList([1, 15]),
  }),
};

//After creating the mocks variable, you can just change mocks: true to simply mocks to pick up your custom mocks
const server = new ApolloServer({
  typeDefs,
  //sets up mocking
  mocks,
});

//server -> start in localhost
server.listen().then(({ url }) => console.log(`Server running at ${url}`));
