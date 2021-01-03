//graphql schema
//Query schema
//Mutation Schema
export const typeDefs = `
    extend type Query {
        login(username: String!, password: String!): LoginResponse!
        user(idToken: String!): User!
        test: String!
    }

    extend type Mutation {
        register(username: String!, email: String!, password: String!): LoginResponse!
        passwordReset(idToken: String!, email: String!, password: String!): LoginResponse
    }

    type User {
        status: String!
        message: String!
        user: UserData
    }

    type UserData {
        email: String,
        username: String
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
        // TODO: create unit test for this
        user: async(_, { idToken }, { auth, db }) => {
            try {
                const idTokenResult = await auth.verifyToken(idToken)

                const response = await db.user(idTokenResult.uid);

                if(response){
                    return {
                        status: "Success",
                        message: "User Found",
                        user: {
                            email: response.email,
                            username: response.username
                        }
                    }
                }   
            } catch (error) {
                return {
                    status: error.toString().split(":")[0].replace(" ",""),
                    message: error.toString().split(":")[1].replace(" ",""),
                    user: null
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
                        message: "Registration successful",
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
        },
        passwordReset: async(_, { idToken, email, password }, {auth, db}) => {
            try {
                const idTokenResult = await auth.verifyToken(idToken)
                    if(idTokenResult){
                        let response = await db.passwordReset(email, password);
                    
                    if(response){
                        return {
                            status: "Success",
                            message: "Password reset successful",
                            accessToken: `${await auth.createAccessToken(response.username)}`
                        }
                    }
                }
                 
                throw new Error("Invalid token")
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