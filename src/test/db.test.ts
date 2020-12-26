import * as assert from 'assert';
import * as firebase from '@firebase/testing';
import { hash, genSalt } from 'bcrypt';
import { serviceAccount } from './config/config';
console.log("JIJJ")
const MY_PROJECT_ID = serviceAccount.projectId;
const myId = "me_test";
const testUser = "user_test";
const testEmail = "user.test@gmail.com";
const testPassword ="password123";
const myAuth = { uid: myId };

const getFirestore = (auth: any) => {
    return firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore();
}

function getAdminFirestore() {
    return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
}

describe("Chat from home db", () => {
    it("Lets admin write to login and user collection", async() => {
        const admin = getAdminFirestore();

        const userRef = admin.collection("user").doc(testUser);
        const loginRef = admin.collection("login").doc(testUser);
        const emailRef = admin.collection("email").doc(testEmail);

        const saltRounds = 12;
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hash(testPassword,salt);

        await firebase.assertSucceeds(userRef.set({ email: `${testEmail}`, username: `${testUser}` }));
        await firebase.assertSucceeds(loginRef.set({ password: `${hashedPassword}` }));
        await firebase.assertSucceeds(emailRef.set({ username: `${testUser}` }));

        await userRef.delete();
        await loginRef.delete();
        await emailRef.delete();

        admin.app.delete();
    });

    it("Doesn't let users write to login and user collection", async() => {
        const admin = getAdminFirestore();
        const db = getFirestore(myAuth);

        let userRef = db.collection("user").doc(testUser);
        let loginRef = db.collection("login").doc(testUser);
        let emailRef = db.collection("email").doc(testEmail);

        const saltRounds = 12;
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hash(testPassword,salt);

        await firebase.assertFails(userRef.set({ email: `${testEmail}`, username: `${testUser}` }));
        await firebase.assertFails(loginRef.set({ password: `${hashedPassword}` }));
        await firebase.assertFails(emailRef.set({ username: `${testUser}` }));

        userRef = admin.collection("user").doc(testUser);
        loginRef = admin.collection("login").doc(testUser);
        emailRef = admin.collection("email").doc(testEmail);

        await userRef.delete();
        await loginRef.delete();
        await emailRef.delete();

        admin.app.delete();
        db.app.delete();
    });

    it("Lets admin read user and login collection", async() => {
        const admin = getAdminFirestore();

        const userRef = admin.collection("user").doc(testUser);
        const loginRef = admin.collection("login").doc(testUser);
        const emailRef = admin.collection("email").doc(testEmail);

        const saltRounds = 12;
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hash(testPassword,salt);

        await firebase.assertSucceeds(userRef.set({ email: `${testEmail}`, username: `${testUser}` }));
        await firebase.assertSucceeds(loginRef.set({ password: `${hashedPassword}` }));
        await firebase.assertSucceeds(emailRef.set({ username: `${testUser}` }));

        await firebase.assertSucceeds(userRef.get());
        await firebase.assertSucceeds(loginRef.get());
        await firebase.assertSucceeds(emailRef.get());

        await userRef.delete();
        await loginRef.delete();
        await emailRef.delete();

        admin.app.delete();
    });

    it("Doesn't let users read login and user collection", async() => {
        const admin = getAdminFirestore();
        const db = getFirestore(myAuth);
        
        let userRef = admin.collection("user").doc(testUser);
        let loginRef = admin.collection("login").doc(testUser);
        let emailRef = admin.collection("email").doc(testEmail);

        const saltRounds = 12;
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hash(testPassword,salt);

        await firebase.assertSucceeds(userRef.set({ email: `${testEmail}`, username: `${testUser}` }));
        await firebase.assertSucceeds(loginRef.set({ password: `${hashedPassword}` }));
        await firebase.assertSucceeds(emailRef.set({ username: `${testUser}` }));

        userRef = db.collection("user").doc(testUser);
        loginRef = db.collection("login").doc(testUser);
        emailRef = db.collection("email").doc(testEmail);

        await firebase.assertFails(userRef.get());
        await firebase.assertFails(loginRef.get());
        await firebase.assertFails(emailRef.get());

        userRef = admin.collection("user").doc(testUser);
        loginRef = admin.collection("login").doc(testUser);
        emailRef = admin.collection("email").doc(testEmail);

        await userRef.delete();
        await loginRef.delete();
        await emailRef.delete();

        admin.app.delete();
        db.app.delete();
    })
});

afterEach(async() => {

});

afterAll(async() => {

});
