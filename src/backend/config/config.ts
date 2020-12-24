import * as dotenv from 'dotenv'
import { ServiceAccount } from 'firebase-admin';
const envFile = process.env.NODE_ENV ? `./.env.${process.env.NODE_ENV}` : '.env';

dotenv.config({ path: envFile });

export const firebaseConfig =  {
    apiKey: `${process.env.APIKEY}`,
    authDomain: `${process.env.AUTHDOMAIN}`,
    databaseURL: `${process.env.DATABASEURL}`,
    projectId: `${process.env.PROJECTID}`,
    storageBucket: `${process.env.STORAGEBUCKET}`,
    messagingSenderId: `${process.env.MESSAGINGSENDERID}`,
    appId: `${process.env.APPID}`,
    measurementId: `${process.env.MEASUREMENTID}`
}

export const serviceAccount: ServiceAccount =  {
    projectId: `${process.env.PROJECT_ID}`,
    clientEmail: `${process.env.CLIENT_EMAIL}`,
    privateKey: `${process.env.PRIVATE_KEY}`
}