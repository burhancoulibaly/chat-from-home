import admin from 'firebase-admin';

export default class Auth{
    constructor(serviceAccount: any = null){
        if(serviceAccount){
            if(!admin.apps.length){
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount)
                })
            }
        }
    }

    public getAdmin = () => {
        return admin
    }

    public createAccessToken = (username: string): Promise<string> => {
        return new Promise(async(resolve, reject) => {
            try {
                const token: string = await admin.auth().createCustomToken(username);
    
                return resolve(token);
            } catch (error) {
                return reject(error);
            }
        })
    }
    
    public verifyToken = (idToken: string): Promise<admin.auth.DecodedIdToken> => {
        return new Promise(async(resolve, reject) => {
            try {
                const res: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(idToken);
    
                return resolve(res);
            } catch (error) {
                return reject(error);
            }
        })
    }
}



