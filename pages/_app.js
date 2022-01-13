import '../styles/styles.scss';
import nookies from 'nookies';
import { memo, useEffect } from 'react';

import { Toaster } from 'react-hot-toast';
import { DataProvider } from '../context/GlobalState';
import {
    genericErrorMsg,
    inactiveUserError,
    noTokensError,
} from '../helpers/internalMessages';
import accountService from '../services/Account.service';

function MyApp({ Component, pageProps, user, error }) {
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
        <DataProvider user={user} error={error}>
            <MemoizedComponent {...pageProps} />
            <Toaster />
        </DataProvider>
    );
}

MyApp.getInitialProps = async ({ ctx }) => {
    const cookies = nookies.get(ctx);
    let tokens = (cookies.tokens && JSON.parse(cookies.tokens)) || {};

    return await accountService
        .me(tokens)
        .then(({ user, newTokens }) => {
            if (
                newTokens &&
                Object.keys(newTokens).includes('accessToken') &&
                Object.keys(newTokens).includes('refreshToken')
            ) {
                nookies.set(ctx, 'tokens', JSON.stringify(newTokens), {
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/',
                });
            }

            return Promise.resolve({ user });
        })
        .catch((error) => {
            if (error === inactiveUserError || error === noTokensError) {
                return { error };
            }

            console.log('==== getInitialProps ERROR ==== ', error);

            return Promise.reject(genericErrorMsg);
        });
};

export default MyApp;
