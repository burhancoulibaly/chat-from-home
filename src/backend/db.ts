import { hash, genSalt, compareSync } from 'bcrypt';
import firebase from '@firebase/testing'

export default class AuthDB{
    private _db;

    constructor(db: FirebaseFirestore.Firestore | firebase.firestore.Firestore){
        this._db = db;
    }

    //TODO: create unit test for this
    public user(username: string){
        return new Promise(async (resolve, reject) => {
            try {
                let user = await this._db.collection('user').doc(username).get();
                
                if(user){
                    return resolve(user.data());
                }

                return reject(new Error("User not found"));
            } catch (error) {
                return reject(error);
            }
        })
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
    
    
                const userRef = this._db.collection('user').doc(username);
                const loginRef = this._db.collection('login').doc(username);
                const emailRef = this._db.collection('email').doc(email);
    
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

    public passwordReset(email: string, password: string){
        return new Promise(async (resolve, reject) => {
            try {
                const saltRounds = 12;
                const salt = await genSalt(saltRounds);
                const hashedPassword = await hash(password,salt);

                const emailRef = await (await this._db.collection('email').doc(email).get()).data();

                if(!emailRef){
                    return reject(new Error("User with that email doesn't exist"))
                }
                
                const loginRef = this._db.collection('login').doc(emailRef.username);
                const response = await (await loginRef.get()).data();

                if(!response){
                    return reject(new Error("User doesn't exist"))
                }

                if (!compareSync(password, response.password)){
                    await loginRef.update({
                        password: `${hashedPassword}`,
                    })
    
                    return resolve({
                        username: emailRef.username
                    });
                }else{
                    return reject(new Error("You cannot use the same password"));
                }
            } catch (error) {
                return reject(error);
            }
        })
    }
}
