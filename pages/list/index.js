import dynamic from 'next/dynamic';
import CardLink from '../../components/CardLink';

const HeaderLayout = dynamic(() => import('../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../components/Layout'));

const Col = dynamic(() => import('@dataesr/react-dsfr').then((mod) => mod.Col));
const Container = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Container)
);
const Row = dynamic(() => import('@dataesr/react-dsfr').then((mod) => mod.Row));

export default function List() {
    return (
        <Layout>
            <HeaderLayout pageTitle={`Listes qualifiées`} />
            <Container>
                <Row gutters>
                    <Col n="3">
                        <CardLink
                            link="/list/0"
                            supInfo="Liste qualifiée"
                            info="Liste 0"
                        />
                    </Col>
                    <Col n="3">
                        <CardLink
                            link="/list/1"
                            supInfo="Liste qualifiée"
                            info="Liste 1"
                        />
                    </Col>
                    <Col n="3">
                        <CardLink
                            link="/list/2"
                            supInfo="Liste qualifiée"
                            info="Liste 2"
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
