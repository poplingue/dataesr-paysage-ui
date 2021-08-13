import Head from 'next/head';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
export default function Layout({ children }) {
    //TODO manage error boundaries https://blog.openreplay.com/catching-errors-in-react-with-error-boundaries
    return (
        <>
            <Head>
                <title>Paysage v1</title>
                <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet"/>
            </Head>
            <Link href="/">Go Home</Link>
            {children}
            <Toaster/>
        </>
    );
}
