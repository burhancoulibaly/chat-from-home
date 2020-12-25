import * as assert from 'assert';
import { createAccessToken, verifyToken } from '../backend/auth';
import { firebaseConfig } from './config/config';
import testFirebaseApp from 'firebase';
require('firebase/auth')

const testUser1 = "user_test1";

function getFirebaseApp() {
    return testFirebaseApp.initializeApp(firebaseConfig);
}

describe("Chat from home backend auth functions", () => {
    it("Returns an access token string when given a username", async() => {
        expect(await createAccessToken(testUser1));
    });

    it("Returns a valid id token given a valid parameters", async() => {
        const firebaseApp = getFirebaseApp();

        const accessToken = await createAccessToken(testUser1);
        
        expect(await firebaseApp.auth().signInWithCustomToken(accessToken));

        firebaseApp.delete();
    })

    it("Returns an error when given a valid parameters", async() => {
        const firebaseApp = getFirebaseApp();
        
        try {
            await firebaseApp.auth().signInWithCustomToken("fake_access_token");
        } catch (error) {
            expect(error);
        }

        firebaseApp.delete();
    })

    it("Can verify a valid id token", async() => {
        const firebaseApp = getFirebaseApp();

        const accessToken = await createAccessToken(testUser1);

        const tokenResult = await (await firebaseApp.auth().signInWithCustomToken(accessToken)).user?.getIdTokenResult();

        expect(await verifyToken(tokenResult ? tokenResult.token : ""));

        await firebaseApp.delete();
    })

    it("Cannot verify an invalid id token", async() => {
        const firebaseApp = getFirebaseApp();

        try {
            await verifyToken("gyuguyg")
        } catch (error) {
            expect(error);
        }

        await firebaseApp.delete();
    })
});