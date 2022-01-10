import { Tag } from '@dataesr/react-dsfr';
import dsfrGrid from '../../../helpers/imports';
import CalloutPerson from '../../CalloutPerson';

export default function Contact() {
    const { Col, Row, Container } = dsfrGrid();

    return (
        <Container fluid>
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
                <Col n="12" spacing="py-2w">
                    <Row>
                        <Col n="2">
                            <Tag
                                title="Linkedin"
                                href="www.linkedin.com"
                                icon="ri-external-link-line"
                            >
                                Linkedin
                            </Tag>
                        </Col>
                        <Col n="2">
                            <Tag
                                title="Wikipédia"
                                href="www.wikipedia.com"
                                icon="ri-external-link-line"
                            >
                                Wikipédia
                            </Tag>
                        </Col>
                        <Col n="2">
                            <Tag
                                title="Twitter"
                                href="www.twitter.com"
                                icon="ri-external-link-line"
                            >
                                Twitter
                            </Tag>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}
