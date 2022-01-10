import dsfrGrid from '../../../helpers/imports';
import CardLink from '../../CardLink';

export default function Functions() {
    const { Col, Row, Container } = dsfrGrid();

    return (
        <Container fluid>
            <Row gutters>
                <Col>
                    <CardLink
                        link="/object/structure/0"
                        supInfo="du 01/01/2019 au 31/12/2022"
                        info="Une fonction très très importante"
                        subInfo="Université de Nanterre"
                    />
                </Col>
                <Col>
                    <CardLink
                        link="/object/structure/1"
                        supInfo="du 01/01/2019 au 31/12/2022"
                        info="Une autre fonction très très importante"
                        subInfo="Université de Saclay"
                    />
                </Col>
            </Row>
        </Container>
    );
}
