import '../styles/styles.scss';
import cookie from 'cookie';
import { memo } from 'react';

import { Toaster } from 'react-hot-toast';
import { DataProvider } from '../context/GlobalState';
import { userService } from '../services/User.service';

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

    return await userService
        .me(tokens)
        .then(({ data }) => {
            console.log('==== getInitialProps User ==== ', data);

            return Promise.resolve({ user: data });
        })
        .catch((error) => {
            console.log('==== getInitialProps ERROR ==== ', error);

            return { error };
        });
};

export default MyApp;
