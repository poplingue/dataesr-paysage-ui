import '../styles/styles.scss';
import cookie from 'cookie';
import { memo, useEffect } from 'react';

import { Toaster } from 'react-hot-toast';
import { DataProvider } from '../context/GlobalState';
import { inactiveUserError, noTokensError } from '../helpers/internalMessages';
import accountService from '../services/Account.service';

function MyApp({ Component, pageProps, user, userError, technicalError }) {
    const MemoizedComponent = memo(Component);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js').then(
                    function (registration) {
                        console.log(
                            'Service Worker registration successful with scope: ',
                            registration.scope
                        );
                    },
                    function (err) {
                        console.log(
                            'Service Worker registration failed: ',
                            err
                        );
                    }
                );
            });
        }
    }, []);

    return (
        <DataProvider user={user} error={technicalError} userError={userError}>
            <MemoizedComponent {...pageProps} />
            <Toaster />
        </DataProvider>
    );
}

MyApp.getInitialProps = async ({ ctx }) => {
    let cookiesHeader = '';
    let tokens = {};

    if (ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
        cookiesHeader = cookie.parse(ctx.req.headers.cookie);
    }

    if (
        cookiesHeader &&
        Object.keys(cookiesHeader).includes('tokens') &&
        cookiesHeader.tokens
    ) {
        tokens = JSON.parse(cookiesHeader.tokens);
    }

    return await accountService
        .me(tokens)
        .then(({ data }) => {
            return { user: data };
        })
        .catch((error) => {
            if (error === inactiveUserError || error === noTokensError) {
                return { userError: error };
            }

            return { technicalError: error };
        });
};

export default MyApp;
