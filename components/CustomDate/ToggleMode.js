import { Button, Icon } from '@dataesr/react-dsfr';
import { cloneElement, useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';

export default function ToggleMode({ inputMode, uid, children, active }) {
    const { Col, Row, Container } = grid();

    const {
        stateForm: { fieldsMode },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const onToggleChange = (uid, mode) => {
        const currentField = fieldsMode[uid];

        if (currentField) {
            const payloadMode = {
                true: mode,
                false: currentField.mode === 'input' ? 'select' : 'input',
            };

            dispatch({
                type: 'UPDATE_FIELDS_MODE',
                payload: {
                    [uid]: { mode: payloadMode[mode !== undefined] },
                },
            });
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col n="12">
                    {cloneElement(children, {
                        ...children.props,
                        onToggleChange: onToggleChange,
                    })}
                </Col>
                {active && (
                    <Col spacing="py-2w" className="txt-right">
                        <Icon
                            size="2x"
                            name={
                                inputMode ? 'ri-toggle-fill' : 'ri-toggle-line'
                            }
                        >
                            <Button
                                data-cy={`toggle-${uid}`}
                                title="Mode"
                                size="sm"
                                secondary={!inputMode}
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
