import { Tag } from '@dataesr/react-dsfr';
import grid from '../../../helpers/imports';
import CalloutCustom from '../../CalloutCustom';

export default function Contact() {
    const { Col, Row, Container } = grid();

    return (
        <Container fluid>
            <Row gutters>
                <Col>
                    <CalloutCustom
                        title="Téléphone"
                        description="+33 15 78 54 34 99"
                        colorFamily="pink-macaron"
                    />
                </Col>
                <Col>
                    <CalloutCustom
                        title="Email"
                        description="madameBilly@email.com"
                        colorFamily="pink-macaron"
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
