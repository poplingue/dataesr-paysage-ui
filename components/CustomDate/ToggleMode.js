import { Button, Icon } from '@dataesr/react-dsfr';
import grid from '../../helpers/imports';

export default function ToggleMode({
    mode,
    uid,
    children,
    onToggleChange,
    active,
}) {
    const { Col, Row, Container } = grid();

    return (
        <Container fluid>
            <Row>
                <Col n="12">{children}</Col>
                {active && (
                    <Col n="12" spacing="py-2w">
                        <Icon
                            color=""
                            size="2x"
                            name={mode ? 'ri-toggle-fill' : 'ri-toggle-line'}
                        >
                            <Button
                                data-cy={`toggle-${uid}`}
                                title="Mode"
                                size="sm"
                                secondary={!mode}
                                onClick={() => onToggleChange(uid)}
                            >
                                {'antérieure à 1930'}
                            </Button>
                        </Icon>
                    </Col>
                )}
            </Row>
        </Container>
    );
}
