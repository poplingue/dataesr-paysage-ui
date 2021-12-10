const path = require('path');
const withTM = require('@vercel/edge-functions-ui/transpile')();
const withSass = require('@zeit/next-sass');
module.exports = withSass();

//TODO manage base url dev/prod
module.exports = withTM();
module.exports = {
    serverRuntimeConfig: {
        // Will only be available on the server side
        secondSecret: process.env.SECOND_SECRET, // Pass through env variables
        authApiUrl: 'https://api.paysage.staging.dataesr.ovh',
    },
    publicRuntimeConfig: {
        // Will be available on both server and client
        baseApiUrl: 'http://localhost:3000/api',
        devBaseUrl: process.env.API_URL || 'http://localhost:3000',
    },
    sassOptions: { includePaths: [path.join(__dirname, 'styles')] },
    reactStrictMode: true,
};
