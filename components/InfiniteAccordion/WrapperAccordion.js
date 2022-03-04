import grid from '../../helpers/imports';

export default function WrapperAccordion({
    sectionRef,
    colSize,
    dataId,
    children,
}) {
    const { Col, Row, Container } = grid();

    return (
        <li data-id={dataId}>
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
