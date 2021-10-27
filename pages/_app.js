import '../styles/styles.scss';
import { memo } from 'react';
import { DataProvider } from '../context/GlobalState';

function MyApp({ Component, pageProps }) {
    const MemoizedComponent = memo(Component);

    return <DataProvider>
        <MemoizedComponent {...pageProps} />
    </DataProvider>;
}

export default MyApp;
