import {
    Callout,
    CalloutText,
    CalloutTitle,
    Col,
    Container,
    Row,
} from '@dataesr/react-dsfr';
import useCSSProperty from '../../../hooks/useCSSProperty';

export default function Contact() {
    const { style: pink } = useCSSProperty('--pink-tuile-main-556');

    return (
        <Container>
            <Row>
                <Col>
                    <Callout hasInfoIcon={false} color={pink}>
                        <CalloutTitle className="fs-14-24">
                            Callout title
                        </CalloutTitle>
                        <CalloutText>
                            Callout text that might be short and concise.
                        </CalloutText>
                    </Callout>
                </Col>
            </Row>
        </Container>
    );
}
