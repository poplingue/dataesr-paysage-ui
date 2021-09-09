import getConfig from 'next/config';
import Link from 'next/link';
import Layout from '../components/Layout';
import styles from '../styles/Home.module.css';

export default function Home() {
    const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

    // console.log(serverRuntimeConfig.secondSecret);
    // console.log(publicRuntimeConfig.user);

    return (
        <Layout mainTitle="Paysage">
            user: {serverRuntimeConfig.user}
            <div className={styles.container}>
                <main className={styles.main}>
                    <h1 className={styles.title}>
                        Welcome to <a href="https://nextjs.org">Next.js!</a>
                    </h1>
                    <p className={styles.description}>
                        Get started by editing{' '}
                        <code className={styles.code}>pages/index.js</code>
                    </p>
                    <ul>
                        <li>
                            <Link href="person/create">Create a Person</Link>
                        </li>
                        <li>
                            <Link href="structure/create">Create a Structure</Link>
                        </li>
                    </ul>
                </main>
            </div>
        </Layout>
    );
}
