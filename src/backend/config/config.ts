import * as dotenv from 'dotenv'
import { ServiceAccount } from 'firebase-admin';
const envFile = process.env.NODE_ENV ? `./.env.${process.env.NODE_ENV}` : '.env';

dotenv.config({ path: envFile });

export const serviceAccount: ServiceAccount =  {
    projectId: `${process.env.PROJECT_ID}`,
    clientEmail: `${process.env.CLIENT_EMAIL}`,
    privateKey: process.env.CIRCLECI ? `${JSON.parse(process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : "")}` : `${process.env.PRIVATE_KEY}`
}