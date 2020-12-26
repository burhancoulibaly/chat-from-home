const { defaults } = require('jest-config');

module.exports = {
    verbose: true,
    roots: ['<rootDir>'], 
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testPathIgnorePatterns: [
        "./dist",
        // "./src/test/auth.test.ts",
        // "./src/test/resolvers.test.ts"
    ] 
}

