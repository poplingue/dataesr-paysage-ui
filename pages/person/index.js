import Layout from '../../components/Layout';
import Link from 'next/link';
import styles from '../../styles/Person.module.scss';

export default function Person() {
    return (
        <Layout>
            <div className={styles.test}>
                <h1>Person page</h1>
                <Link href="/person/create">Go to Create</Link>
            </div>
        </Layout>
    );
}
