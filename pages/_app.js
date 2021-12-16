import '../styles/styles.scss';
import cookie from 'cookie';
import { memo } from 'react';

import { Toaster } from 'react-hot-toast';
import { DataProvider } from '../context/GlobalState';
import {
    genericErrorMsg,
    inactiveUserError,
    noTokensError,
} from '../helpers/internalMessages';
import { accountService } from '../services/Account.service';

function MyApp({ Component, pageProps, user, error }) {
    const MemoizedComponent = memo(Component);

    return (
        <DataProvider user={user} error={error}>
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
            console.log('==== getInitialProps USER ==== ', data);

            return Promise.resolve({ user: data });
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
