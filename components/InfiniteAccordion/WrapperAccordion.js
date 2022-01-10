import dsfrGrid from '../../helpers/imports';

export default function WrapperAccordion({
    sectionRef,
    key,
    colSize,
    children,
}) {
    const { Col, Row, Container } = dsfrGrid();

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
