import * as assert from 'assert';
import * as firebase from '@firebase/testing';
import { createAccessToken, verifyToken } from '../backend/auth';
import { serviceAccount, firebaseConfig } from './config/config';
import admin from 'firebase-admin';
import testFirebaseApp from 'firebase';
require('firebase/auth')

const MY_PROJECT_ID = serviceAccount.projectId;
const testUser1 = "user_test1";
const testUser2 = "user_test2";

const getFirestore = (auth: any) => {
    return firebase.initializeTestApp({ projectId: MY_PROJECT_ID, auth: auth });
}

function getAdminAuth() {
    return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID });
}

function getFirebaseApp() {
    return testFirebaseApp.initializeApp(firebaseConfig);
}

describe("Chat from home backend auth functions", () => {
    it("Returns an access token string when given a username", async() => {
        expect(await createAccessToken(testUser1));
    });

    it("Returns a valid access token given a username", async() => {
        const firebaseApp = getFirebaseApp();

        const accessToken = await createAccessToken(testUser1);
        
        expect(await firebaseApp.auth().signInWithCustomToken(accessToken));

        firebaseApp.delete();
    })

    it("Can validate a valid token", async() => {
        const firebaseApp = getFirebaseApp();

        const accessToken = await createAccessToken(testUser1);

        const tokenResult = await (await firebaseApp.auth().signInWithCustomToken(accessToken)).user?.getIdTokenResult();

        expect(await verifyToken(tokenResult ? tokenResult.token : ""));

        await firebaseApp.delete();
    })
});