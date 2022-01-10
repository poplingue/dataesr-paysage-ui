import dynamic from 'next/dynamic';
import Link from 'next/link';

const HeaderLayout = dynamic(() => import('../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../components/Layout'));

const Card = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Card)
);
const CardDetail = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.CardDetail)
);
const CardTitle = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.CardTitle)
);
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
                        <Card asLink={<Link href="/list/0" />}>
                            <CardDetail>Liste qualifiée</CardDetail>
                            <CardTitle>Liste 0</CardTitle>
                        </Card>
                    </Col>
                    <Col n="3">
                        <Card asLink={<Link href="/list/1" />}>
                            <CardDetail>Liste qualifiée</CardDetail>
                            <CardTitle>Liste 1</CardTitle>
                        </Card>
                    </Col>
                    <Col n="3">
                        <Card asLink={<Link href="/list/2" />}>
                            <CardDetail>Liste qualifiée</CardDetail>
                            <CardTitle>Liste 2</CardTitle>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
