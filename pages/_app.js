import '../styles/styles.scss';
import { memo, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { DataProvider } from '../context/GlobalState';
import { fetchHelper } from '../helpers/fetch';
import accountService from '../services/Account.service';

function MyApp({ Component, pageProps, error, user = {} }) {
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
    const tokens = fetchHelper.headerTokens(ctx.req, true);

    return await accountService
        .me()
        .then((data) => {
            return { user: data, tokens };
        })
        .catch((error) => {
            return { error };
        });
};

export default MyApp;
