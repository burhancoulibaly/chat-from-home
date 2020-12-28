import express, { response } from 'express';
import cors from 'cors';
import { merge } from 'lodash';
import { ApolloServer } from 'apollo-server-express';
import { resolvers, typeDefs } from './resolvers/resolver';
import { resolvers as userResolver, typeDefs as userTypeDefs } from './resolvers/auth-resolver';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import admin from "firebase-admin";
import { serviceAccount } from './config/config';
import Auth from './auth';
import AuthDB from './db';
import path from 'path'

export const  app: express.Application = express();

//Urls that are allowed to connect to the api
// let whitelist: Array<string> = ['https://chatfromhome.io'];
let whitelist: Array<string> = ['http://localhost:3000', 'localhost:3000', 'http://localhost:3001', 'localhost:3001', 'localhost'];

let corsOptions = {
  //Checks if origin is in whitelist if not an error is returned
  origin: function (origin: any, callback: any) {
    console.log(origin)
    if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
    } else {
        callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

export const adminApp = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
export const auth = new Auth()

//integrating graphql settings
export const apolloServer = new ApolloServer({
  typeDefs: [typeDefs, userTypeDefs], 
  resolvers: merge(resolvers, userResolver),
  context: async() => ({ db: new AuthDB(adminApp.firestore()), auth: { createAccessToken: auth.createAccessToken } })
});

if(!process.env.NODE_ENV || process.env.NODE_ENV === "production"){
  app.use(cors(corsOptions))
}else{
  app.use(cors())
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

apolloServer.applyMiddleware({ 
  app,
  cors: false
});
