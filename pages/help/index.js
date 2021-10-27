import { Col, Container, Row } from '@dataesr/react-dsfr';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';

export default function Help() {
    return (
        <Layout>
            <HeaderLayout pageTitle="Aide" />
            <Container fluid>
                <Row>
                    <Col>
                        <p>Aide...</p>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
