import dynamic from 'next/dynamic';

const HeaderLayout = dynamic(() => import('./../../components/HeaderLayout'));
const Layout = dynamic(() => import('./../../components/Layout'));

export default function Resources() {
    return (
        <Layout>
            <HeaderLayout pageTitle="Ressources" />
        </Layout>
    );
}
