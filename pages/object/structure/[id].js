import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import BigButton from '../../../components/BigButton';
import HeaderLayout from '../../../components/HeaderLayout';
import Layout from '../../../components/Layout';

export default function Object() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Layout>
            <HeaderLayout pageTitle="Une Structure"/>
            <Container>
                <Row>
                    <Col>
                        Structure : {id}
                    </Col>
                    <Col>
                        <BigButton
                            square={false}
                            onClick={() => {
                            }}
                            title="Ajouter un nouveau texte"
                            icon="ri-add-circle-line"
                        >
                        </BigButton>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
