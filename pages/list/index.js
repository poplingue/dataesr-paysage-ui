import {
    Card,
    CardDetail,
    CardTitle,
    Col,
    Container,
    Row,
} from '@dataesr/react-dsfr';
import Link from 'next/link';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';

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
