const path = require('path');
const withTM = require('@vercel/edge-functions-ui/transpile')();
const withSass = require('@zeit/next-sass');
module.exports = withSass();

const baseApiUrl =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/api'
        : process.env.API_URL;
const basePath =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.BASE_PATH;

module.exports = withTM();
module.exports = {
    serverRuntimeConfig: {
        // Will only be available on the server side
        secondSecret: process.env.SECOND_SECRET, // Pass through env variables
        authApiUrl: 'https://api.paysage.staging.dataesr.ovh',
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        basePath,
        baseApiUrl,
    },
    sassOptions: { includePaths: [path.join(__dirname, 'styles')] },
    reactStrictMode: true,
};
