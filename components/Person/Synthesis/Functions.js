import { Col, Container, Row } from '@dataesr/react-dsfr';
import CardLink from '../../CardLink';

export default function Functions() {
    return (
        <Container fluid>
            <Row gutters>
                <Col>
                    <CardLink
                        link="/object/structure/1"
                        date="du 01/01/2019 au 31/12/2022"
                        title="Une fonction très très importante"
                        structure="Université de Nanterre"
                    />
                </Col>
                <Col>
                    <CardLink
                        link="/object/structure/1"
                        date="du 01/01/2019 au 31/12/2022"
                        title="Une autre fonction très très importante"
                        structure="Université de Saclay"
                    />
                </Col>
            </Row>
        </Container>
    );
}
