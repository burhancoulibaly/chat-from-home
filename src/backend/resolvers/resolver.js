//graphql schema
//Query schema
//Mutation Schema
export const typeDefs = `
    type Query {
        _empty: String!
    }

    type Mutation {
        _empty: String!
    }

    type Response {
        status: String!
        message: String!
    }
`;

export const resolvers = {}