const { defaults } = require('jest-config');

module.exports = {
    verbose: true,
    roots: ['<rootDir>'], 
    testPathIgnorePatterns: [
        "./dist",
        // "./src/test/auth.test.ts",
        // "./src/test/db.test.ts",
        // "./src/test/resolvers.test.ts",
        // "./src/test/server.test.ts",
    ] 
}

