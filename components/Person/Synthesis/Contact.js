import { Callout, CalloutText, CalloutTitle, Col, Container, Row } from '@dataesr/react-dsfr';
import { getCSSValue } from '../../../helpers/utils';

export default function Contact() {
    return <Container>
        <Row>
            <Col>
                <Callout hasInfoIcon={false} color={getCSSValue('--pink-soft-700')}>
                    <CalloutTitle className="fs-14-24">Callout title</CalloutTitle>
                    <CalloutText>Callout text that might be short and concise.</CalloutText>
                </Callout>
            </Col>
        </Row>
    </Container>;
}
