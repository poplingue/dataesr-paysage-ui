import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Layout from '../components/Layout';

export default function Home() {
    return (
        <Layout mainTitle="Paysage">
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
