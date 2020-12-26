const { defaults } = require('jest-config');

module.exports = {
    verbose: true,
    roots: ['<rootDir>'], 
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: [
        "./dist",
        // "./src/test/auth.test.ts",
        // "./src/test/resolvers.test.ts"
    ] 
}

