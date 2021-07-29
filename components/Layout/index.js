import Head from 'next/head';

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <title>Paysage v1</title>
                <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet"/>
            </Head>
            {children}
        </>
    );
}
