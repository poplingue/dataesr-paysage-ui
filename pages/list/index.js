import { Card, CardDetail, CardTitle, Col, Container, Row } from '@dataesr/react-dsfr';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function List() {

    return (
        <Layout pageTitle="Listes qualifiées">
            <Container fluid>
                <Row>
                    <Col n="3">
                        <Card asLink={<Link href="/list/5"/>}>
                            <CardDetail>Liste qualifiée</CardDetail>
                            <CardTitle>
                                Catégorie 5
                            </CardTitle>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
