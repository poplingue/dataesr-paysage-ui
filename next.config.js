const path = require('path');
const withSass = require('@zeit/next-sass');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');
module.exports = withSass();
module.exports = {
    serverRuntimeConfig: {
        // Will only be available on the server side
        secondSecret: process.env.SECOND_SECRET, // Pass through env variables
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        user: 'toto',
    },
    target: 'serverless',
    sassOptions: { includePaths: [path.join(__dirname, 'styles')] },
    reactStrictMode: true,
};
