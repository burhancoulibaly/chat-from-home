import {  adminApp, auth} from "../backend/server-setup";

afterAll(async() => {

});

describe("Test Chat From Home server", () => {
    it("Creates a valid db instance", async() => {
        expect(await adminApp.options.credential?.getAccessToken())
    })

    it("Creates a valid db instance", async() => {
        expect(await auth.getAdmin().app().options.credential?.getAccessToken())
    })
});
