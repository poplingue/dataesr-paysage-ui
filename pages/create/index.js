import { Col, Container, Row } from '@dataesr/react-dsfr';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
import LinkTo from '../../components/LinkTo';

export default function Create() {
    return (
        <Layout>
            <HeaderLayout pageTitle="Create" />
            <Container>
                <Row>
                    <Col>
                        <LinkTo
                            text="Créer un nouvel Établissement"
                            href="/create/structure"
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
