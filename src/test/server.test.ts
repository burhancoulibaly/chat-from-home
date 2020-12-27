import { Response } from "express";
import * as firebase from '@firebase/testing';
import { hash, genSalt } from 'bcrypt';
import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { app, db, apolloServer} from "../backend/server-setup";

const { query, mutate } = createTestClient(apolloServer);

const testUser = "user_test_server";
const testFakeUser = "fake_user_test_server"; 
const testEmail = "user.test_server@gmail.com";
const testPassword = "password123_server";
const testFakePassword = "fakepassword123_server";

afterAll(async() => {

});

describe("Test Chat From Home server", () => {
    it("Should return a status of success and a token on successful login (server)", async() => {
        const userRef = db.collection("user").doc(testUser);
        const loginRef = db.collection("login").doc(testUser);
        const emailRef = db.collection("email").doc(testEmail);

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
    });

    it("Should return a error if user does exist but password is incorrect (server)", async() => {
        const userRef = db.collection("user").doc(testUser);
        const loginRef = db.collection("login").doc(testUser);
        const emailRef = db.collection("email").doc(testEmail);

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
    });

    it("Returns a token and status of success on successful registration (server)", async() => {
        const userRef = db.collection("user").doc(testUser);
        const loginRef = db.collection("login").doc(testUser);
        const emailRef = db.collection("email").doc(testEmail);

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
    });

    it("Returns an error if username already exist (server)", async() => {
        const userRef = db.collection("user").doc(testUser);
        const loginRef = db.collection("login").doc(testUser);
        const emailRef = db.collection("email").doc(testEmail);

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
    });

    it("Returns an error if email already exist (server)", async() => {
        const userRef = db.collection("user").doc(testUser);
        const loginRef = db.collection("login").doc(testUser);
        const emailRef = db.collection("email").doc(testEmail);

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
    })
});
