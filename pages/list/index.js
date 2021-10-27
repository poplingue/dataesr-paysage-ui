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
            <HeaderLayout pageTitle="Listes qualifiées de structure" />
            <Container>
                <Row>
                    <Col n="3">
                        <Card asLink={<Link href="/list/0" />}>
                            <CardDetail>Liste qualifiée</CardDetail>
                            <CardTitle>Catégorie 0</CardTitle>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
