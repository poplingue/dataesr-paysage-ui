import '../styles/styles.scss';
import { memo, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { DataProvider } from '../context/GlobalState';

function MyApp({ Component, pageProps = {} }) {
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
        <DataProvider>
            <MemoizedComponent {...pageProps} />
            <Toaster />
        </DataProvider>
    );
}

export default MyApp;
