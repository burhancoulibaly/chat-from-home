import { serviceAccount } from './config/config';
import admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

export const createAccessToken = (username: string): Promise<string> => {
    return new Promise(async(resolve, reject) => {
        try {
            const token: string = await admin.auth().createCustomToken(username);

            return resolve(token);
        } catch (error) {
            return reject(error);
        }
    })
}

export const verifyToken = (idToken: string): Promise<admin.auth.DecodedIdToken> => {
    return new Promise(async(resolve, reject) => {
        try {
            const res: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(idToken);
            return resolve(res);
        } catch (error) {
            return reject(error);
        }
    })
}

