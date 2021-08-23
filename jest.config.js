module.exports = {
    setupFilesAfterEnv: ['./jest.setup.js'],
    testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
    'moduleNameMapper': {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    }
};
