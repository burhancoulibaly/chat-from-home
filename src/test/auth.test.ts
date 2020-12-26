import * as assert from 'assert';
import { serviceAccount } from './config/config';
import Auth from '../backend/auth';
import { firebaseConfig } from './config/config';
import testFirebaseApp from 'firebase';
require('firebase/auth')

const testUser1 = "user_test1";
let auth = new Auth({
    projectId: `${process.env.PROJECT_ID}`,
    clientEmail: `${process.env.CLIENT_EMAIL}`,
    privateKey: `${process.env.PRIVATE_KEY};`
});

function getFirebaseApp() {
    return testFirebaseApp.initializeApp(firebaseConfig);
}

beforeAll(async() => {

});

afterAll(async() => {

});

afterEach(async() => {

});

describe("Chat from home backend auth functions", () => {
    it("Returns an access token string when given a username", async() => {
    
        expect(await auth.createAccessToken(testUser1));
    });

    it("Returns a valid id token given a valid parameters", async() => {
        const firebaseApp = getFirebaseApp();

        const accessToken = await auth.createAccessToken(testUser1);
    
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

        const accessToken = await auth.createAccessToken(testUser1);

        const tokenResult = await (await firebaseApp.auth().signInWithCustomToken(accessToken)).user?.getIdTokenResult();

        expect(await auth.verifyToken(tokenResult ? tokenResult.token : ""));

        await firebaseApp.delete();
    })

    it("Cannot verify an invalid id token", async() => {
        const firebaseApp = getFirebaseApp();

        try {
            await auth.verifyToken("gyuguyg")
        } catch (error) {
            expect(error);
        }

        await firebaseApp.delete();
    })
});