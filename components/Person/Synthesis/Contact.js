import { Col, Container, Row } from '@dataesr/react-dsfr';
import CalloutPerson from '../../CalloutPerson';

export default function Contact() {
    return (
        <Container>
            <Row gutters>
                <Col>
                    <CalloutPerson
                        title="Téléphone"
                        description="+33 15 78 54 34 99"
                    />
                </Col>
                <Col>
                    <CalloutPerson
                        title="Email"
                        description="madameBilly@email.com"
                    />
                </Col>
            </Row>
        </Container>
    );
}
