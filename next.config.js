const path = require('path');
const withSass = require('@zeit/next-sass');
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
    sassOptions: { includePaths: [path.join(__dirname, 'styles')] },
    reactStrictMode: true,
};
