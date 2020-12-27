import { hash, genSalt, compareSync } from 'bcrypt';
import firebase from '@firebase/testing'

export default class AuthDB{
    private _db;

    constructor(db: FirebaseFirestore.Firestore | firebase.firestore.Firestore){
        this._db = db;
    }

    public login(username: string, password: string){
        return new Promise(async (resolve, reject) => {
            try {
                let snapshot = await this._db.collection('login').doc(username).get();

                let response = snapshot.data();

                if(!response){
                    throw new Error("Invalid login");
                }
        
                if (compareSync(password, response.password)){
                    return resolve(true);
                }else{
                    throw new Error("Invalid login");
                }
            } catch (error) {
                return reject(error);
            }
        });
    }
        
    public register(username: string, email: string, password: string){
        return new Promise(async (resolve, reject) => {
            try {
                const saltRounds = 12;
                const salt = await genSalt(saltRounds);
                const hashedPassword = await hash(password,salt);
    
    
                let userRef = this._db.collection('user').doc(username);
                let loginRef = this._db.collection('login').doc(username);
                let emailRef = this._db.collection('email').doc(email);
    
                let response = (await userRef.get()).data();
                
                if(response){
                    throw new Error('An account already exist with this username');
                }

                response = (await emailRef.get()).data();
                
                if(response){
                    throw new Error('An account is already associated with this email');
                }
    
                await userRef.set({
                    email: `${email}`,
                    username: `${username}`,
                })
    
                await loginRef.set({
                    password: `${hashedPassword}`,
                })

                await emailRef.set({
                    username: `${username}`
                })
    
                return resolve(true);
            } catch (error) {
                return reject(error);
            }
        });
    }
}
