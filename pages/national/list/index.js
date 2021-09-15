import { Card, CardDetail, CardTitle, Col, Container, Row } from '@dataesr/react-dsfr';
import Link from 'next/link';
import Layout from '../../../components/Layout';

export default function List() {

    return (
        <Layout pageTitle="Listes qualifiées d'établissements">
            <Container fluid>
                <Row>
                    <Col n="3">
                        <Card asLink={<Link href="/national/list/university"/>}>
                            <CardDetail>Liste qualifiée</CardDetail>
                            <CardTitle>
                                Universités
                            </CardTitle>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
