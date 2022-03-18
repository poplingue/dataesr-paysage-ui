const path = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});
const withTM = require('@vercel/edge-functions-ui/transpile')();
const withSass = require('@zeit/next-sass');
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([withBundleAnalyzer({}), withSass(), withTM()], {
    serverRuntimeConfig: {
        // Will only be available on the server side
        secondSecret: process.env.SECOND_SECRET, // Pass through env variables
        dataesrApiAuthUrl: process.env.API_AUTH_URL,
        dataesrApiUrl: process.env.API_URL,
    },
    publicRuntimeConfig: {
        baseApiUrl: process.env.NEXT_API_URL,
    },
    sassOptions: { includePaths: [path.join(__dirname, 'styles')] },
    reactStrictMode: true,

    async redirects() {
        return [
            {
                source: '/account/sign-in',
                has: [
                    {
                        type: 'cookie',
                        key: 'tokens',
                    },
                ],
                permanent: true,
                destination: '/',
            },
        ];
    },
});
