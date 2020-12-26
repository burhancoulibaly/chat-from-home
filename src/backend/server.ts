import express from 'express';
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

const  app: express.Application = express();
const server: any = require('http').createServer(app);

//Urls that are allowed to connect to the api
let whitelist: Array<string>;

if(!process.env.NODE_ENV || process.env.NODE_ENV === "development"){
  whitelist = ['http://localhost:3000', 'http://localhost:3000/graphql', 'http://localhost:4200', 'http://localhost:3200'];
}else{
  whitelist = [''];
}

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

const db = admin.firestore();

//integrating graphql settings
const apolloServer = new ApolloServer({
  typeDefs: [typeDefs, userTypeDefs], 
  resolvers: merge(resolvers, userResolver),
  context: async() => ({ db: new AuthDB(db), auth: { createAccessToken: new Auth({serviceAccount}).createAccessToken } })
});

app.use(cors())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

apolloServer.applyMiddleware({ 
  app,
  cors: false
});

server.listen(process.env.PORT || 3000);
console.log('Server running on port: ',process.env.PORT || 3000);
