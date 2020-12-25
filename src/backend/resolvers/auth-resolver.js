//graphql schema
//Query schema
//Mutation Schema
export const typeDefs = `
    extend type Query {
        login(username: String!, password: String!): LoginResponse!
        test: String!
    }

    extend type Mutation {
        register(username: String!, email: String!, password: String!): LoginResponse!
    }

    type LoginResponse {
        status: String!
        message: String!
        accessToken: String!
    }
`;

export const resolvers = {
    //Returns data from queries
    Query: {
        login: async(_, { username, password }, { auth, db }) => {
            try {
                await db.login(username, password);

                return {
                    status: "Success",
                    message: "Login successful",
                    accessToken: `${await auth.createAccessToken(username)}`
                }
            } catch (error) {
                return {
                    status: error.toString().split(":")[0].replace(" ",""),
                    message: error.toString().split(":")[1].replace(" ",""),
                    accessToken: ""
                }
            }
        },
        test: async(_, { }, { db, auth }) => {
            return "hello";
        }
    },
    //Mutations make changes to the database
    Mutation: {
        register: async(_, { username, email, password }, {auth, db}) => {
            try {
                let response = await db.register(username, email, password);

                if(response){
                    return {
                        status: "Success",
                        message: "Login successful",
                        accessToken: `${await auth.createAccessToken(username)}`
                    }
                } 

                return {
                    status: "Error",
                    message: "Invalid login",
                    accessToken: ""
                }
            } catch (error) {
                return {
                    status: error.toString().split(":")[0].replace(" ",""),
                    message: error.toString().split(":")[1].replace(" ",""),
                    accessToken: ""
                }
            }
        }
    }
}