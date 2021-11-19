import { Col, Container, Row } from '@dataesr/react-dsfr';

export default function WrapperAccordion({
    sectionRef,
    key,
    colSize,
    children,
}) {
    return (
        <li key={key}>
            <section ref={sectionRef}>
                <Container fluid>
                    <Row gutters>
                        <Col n={colSize} className="pt-0" spacing="">
                            {children}
                        </Col>
                    </Row>
                </Container>
            </section>
        </li>
    );
}
