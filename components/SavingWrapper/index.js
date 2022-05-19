import { Badge, Col, Container, Row } from '@dataesr/react-dsfr';
import styles from './SavingWrapper.module.scss';

function SavingWrapper({ children, unSaved }) {
    return (
        <Container fluid>
            <Row alignItems="bottom">
                {unSaved ? (
                    <>
                        <Col n="12" className={styles.UnSavedField}>
                            {children}
                        </Col>
                        <Col n="12">
                            <Badge
                                text="non sauvegardé"
                                isSmall
                                type="warning"
                            />
                        </Col>
                    </>
                ) : (
                    <Col>{children}</Col>
                )}
            </Row>
        </Container>
    );
}

export default SavingWrapper;
