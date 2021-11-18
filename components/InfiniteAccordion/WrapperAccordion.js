import { Col, Container, Row } from '@dataesr/react-dsfr';
import styles from './InfiniteAcordion.module.scss';

export default function WrapperAccordion({
    sectionRef,
    key,
    colSize,
    children,
}) {
    return (
        <li className={styles.Accordion} key={key}>
            <section ref={sectionRef}>
                <Container fluid>
                    <Row gutters>
                        <Col n={colSize}>{children}</Col>
                    </Row>
                </Container>
            </section>
        </li>
    );
}
