import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
import LinkTo from '../../components/LinkTo';

export default function Create() {
    return (
        <Layout>
            <HeaderLayout pageTitle="Create" />
            <LinkTo
                text="Créer un nouvel Établissement"
                href="/create/structure"
            />
        </Layout>
    );
}
