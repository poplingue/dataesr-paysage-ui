import '../styles/styles.scss';
import cookie from 'cookie';
import { memo } from 'react';
import { DataProvider } from '../context/GlobalState';
import { userService } from '../services/User.service';

function MyApp({ Component, pageProps, user }) {
    const MemoizedComponent = memo(Component);

    return (
        <DataProvider user={user}>
            <MemoizedComponent {...pageProps} />
        </DataProvider>
    );
}

MyApp.getInitialProps = async ({ ctx }) => {
    let cookiesHeader = '';
    let tokens = {};

    if (ctx.req && ctx.req.headers && ctx.req.headers.cookie) {
        cookiesHeader = cookie.parse(ctx.req.headers.cookie);
    }

    if (Object.keys(cookiesHeader).includes('tokens')) {
        tokens = JSON.parse(cookiesHeader.tokens);
    }

    const user = await userService
        .me(tokens)
        .then(({ data }) => {
            return data;
        })
        .catch((error) => {
            if (error === 'No tokens') {
                return { error: 'You must log in' };
            }
        });

    return { user, tokens };
};

export default MyApp;
