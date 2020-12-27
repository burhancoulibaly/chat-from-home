const { defaults } = require('jest-config');

module.exports = {
    verbose: true,
    roots: ['<rootDir>'], 
    testPathIgnorePatterns: [
        "./dist",
    ] 
}

