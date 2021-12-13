import {
    Card,
    CardDescription,
    CardDetail,
    CardTitle,
    Col,
    Container,
    Row,
} from '@dataesr/react-dsfr';

export default function Functions() {
    return (
        <Container>
            <Row>
                <Col>
                    <Card>
                        <CardDetail>Detail</CardDetail>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>
                            Lorem ipsum dolor sit amet, consectetur adipisicing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Uenim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat.
                        </CardDescription>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
