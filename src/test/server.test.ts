import {  adminApp, auth} from "../backend/server-setup";

afterAll(async() => {

});

describe("Test Chat From Home server", () => {
    it("Creates a valid admin instance", async() => {
        expect(await adminApp.options.credential?.getAccessToken())
    })
});
