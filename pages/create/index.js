import Link from 'next/link';
import Layout from '../../components/Layout';

export default function Person() {
    return (
        <Layout>
            <div>
                <Link href="/create/person">Ajouter une personne</Link>
                <br/>
                <Link href="/create/structure">Ajouter une structure</Link>
            </div>
        </Layout>
    );
}
