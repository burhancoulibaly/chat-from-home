import * as assert from 'assert';
import * as firebase from '@firebase/testing';
import { hash, genSalt } from 'bcrypt';
import { serviceAccount } from './config/config';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { merge } from 'lodash';
import { resolvers, typeDefs } from '../backend/resolvers/resolver';
import { resolvers as authResolver, typeDefs as authTypeDefs } from '../backend/resolvers/auth-resolver';
import AuthDB from '../backend/db';
import Auth from '../backend/auth';

const MY_PROJECT_ID = serviceAccount.projectId;
const testUser = "user_test";
const testFakeUser = "fake_user_test"; 
const testEmail = "user.test@gmail.com";
const testPassword = "password123";
const testFakePassword = "fakepassword123";
const graphqlTestDB = getAdminFirestore();

const getFirestore = (auth: any) => {
    return firebase.initializeTestApp({projectId: MY_PROJECT_ID, auth: auth}).firestore();
}

function getAdminFirestore() {
    return firebase.initializeAdminApp({ projectId: MY_PROJECT_ID }).firestore();
}

const apolloServer = new ApolloServer({
    typeDefs: [typeDefs, authTypeDefs], 
    resolvers: merge(resolvers, authResolver),
    context: async() => ({ db: new AuthDB(graphqlTestDB), auth: { createAccessToken: new Auth({
        projectId: `${process.env.PROJECT_ID}`,
        clientEmail: `${process.env.CLIENT_EMAIL}`,
        privateKey: `${process.env.PRIVATE_KEY?.replace(/\\n/gm, '\n')};`
    }).createAccessToken } })
});

const { query, mutate } = createTestClient(apolloServer);

beforeAll(async() => {

});

afterAll(async() => {
    graphqlTestDB.app.delete();
});

afterEach(async() => {

});

describe("Chat from home GraphQL auth resolver", () => {
    it("Should return a error if user doesn't exist", async() => {
        const LOGIN = gql(`
            query login($username: String!, $password: String!) {
                login(username: $username, password: $password){
                    status,
                    message,
                    accessToken
                }
            }
        `)

        const res = await query({ 
            query: LOGIN, 
            variables: { username: testUser, password: testPassword } 
        });

        expect(res.data.login)
            .toMatchObject({ status: 'Error', message: 'Invalid login', accessToken: ''});
    });

    it("Should return a status of success and a token on successful login", async() => {
        const admin = getAdminFirestore();

        const userRef = admin.collection("user").doc(testUser);
        const loginRef = admin.collection("login").doc(testUser);
        const emailRef = admin.collection("email").doc(testEmail);

        const saltRounds = 12;
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hash(testPassword,salt);

        await userRef.set({ email: `${testEmail}`, username: `${testUser}` });
        await loginRef.set({ password: `${hashedPassword}` });
        await emailRef.set({ username: `${testUser}` });

        const LOGIN = gql(`
            query login($username: String!, $password: String!) {
                login(username: $username, password: $password){
                    status,
                    message,
                    accessToken
                }
            }
        `)

        const res = await query({ 
            query: LOGIN, 
            variables: { username: testUser, password: testPassword } 
        });

        expect(res.data.login.status)
            .toMatch("Success");

        await userRef.delete();
        await loginRef.delete();
        await emailRef.delete();

        admin.app.delete();
    });

    it("Should return a error if user does exist but password is incorrect", async() => {
        const admin = getAdminFirestore();

        const userRef = admin.collection("user").doc(testUser);
        const loginRef = admin.collection("login").doc(testUser);
        const emailRef = admin.collection("email").doc(testEmail);

        const saltRounds = 12;
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hash(testPassword,salt);

        await userRef.set({ email: `${testEmail}`, username: `${testUser}` });
        await loginRef.set({ password: `${hashedPassword}` });
        await emailRef.set({ username: `${testUser}` });

        const LOGIN = gql(`
            query login($username: String!, $password: String!) {
                login(username: $username, password: $password){
                    status,
                    message,
                    accessToken
                }
            }
        `)

        const res = await query({ 
            query: LOGIN, 
            variables: { username: testUser, password: testFakePassword } 
        });

        expect(res.data.login)
            .toMatchObject({ status: 'Error', message: 'Invalid login', accessToken: ''});

        await userRef.delete();
        await loginRef.delete();
        await emailRef.delete();

        admin.app.delete();
    });

    it("Returns a token and status of success on successful registration", async() => {
        const admin = getAdminFirestore();

        const userRef = admin.collection("user").doc(testUser);
        const loginRef = admin.collection("login").doc(testUser);
        const emailRef = admin.collection("email").doc(testEmail);

        const REGISTER = gql(`
            mutation register($username: String!, $email: String!, $password: String!){
                register(username: $username, email: $email, password: $password){
                    status,
                    message,
                    accessToken
                }
            }
        `)

        const res = await mutate({
            mutation: REGISTER,
            variables: { username: testUser, password: testPassword, email: testEmail } 
        })

        expect(res.data.register.status)
            .toMatch('Success');

        await userRef.delete();
        await loginRef.delete();
        await emailRef.delete();

        admin.app.delete();
    });

    it("Returns an error if username already exist", async() => {
        const admin = getAdminFirestore();

        const userRef = admin.collection("user").doc(testUser);
        const loginRef = admin.collection("login").doc(testUser);
        const emailRef = admin.collection("email").doc(testEmail);

        const saltRounds = 12;
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hash(testPassword,salt);

        await userRef.set({ email: `${testEmail}`, username: `${testUser}` });
        await loginRef.set({ password: `${hashedPassword}` });
        await emailRef.set({ username: `${testUser}` });

        const REGISTER = gql(`
            mutation register($username: String!, $email: String!, $password: String!){
                register(username: $username, email: $email, password: $password){
                    status,
                    message,
                    accessToken
                }
            }
        `)

        const res = await mutate({
            mutation: REGISTER,
            variables: { username: testUser, password: testPassword, email: testEmail } 
        })

        expect(res.data.register)
            .toMatchObject({ status: 'Error', message: 'An account already exist with this username', accessToken: ''});

        await userRef.delete();
        await loginRef.delete();
        await emailRef.delete();

        admin.app.delete();
    });

    it("Returns an error if email already exist", async() => {
        const admin = getAdminFirestore();

        const userRef = admin.collection("user").doc(testUser);
        const loginRef = admin.collection("login").doc(testUser);
        const emailRef = admin.collection("email").doc(testEmail);

        const saltRounds = 12;
        const salt = await genSalt(saltRounds);
        const hashedPassword = await hash(testPassword,salt);

        await userRef.set({ email: `${testEmail}`, username: `${testUser}` });
        await loginRef.set({ password: `${hashedPassword}` });
        await emailRef.set({ username: `${testUser}` });

        const REGISTER = gql(`
            mutation register($username: String!, $email: String!, $password: String!){
                register(username: $username, email: $email, password: $password){
                    status,
                    message,
                    accessToken
                }
            }
        `)

        const res = await mutate({
            mutation: REGISTER,
            variables: { username: testFakeUser, password: testPassword, email: testEmail } 
        })

        expect(res.data.register)
            .toMatchObject({ status: 'Error', message: 'An account is already associated with this email', accessToken: ''});

        await userRef.delete();
        await loginRef.delete();
        await emailRef.delete();

        admin.app.delete();
    })
});