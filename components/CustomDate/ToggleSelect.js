import { Toggle } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { cloneElement, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { getFieldValue, getFormName, getUniqueId } from '../../helpers/utils';

export default function ToggleSelect({
    validatorId,
    subObject,
    toggleMode,
    staticValues,
    children,
}) {
    const { Col, Row, Container } = grid();

    const {
        stateForm: { forms },
    } = useContext(AppContext);

    const {
        pathname,
        query: { object },
    } = useRouter();

    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId);
    const fieldValue = getFieldValue(forms, formName, uid);

    const onToggleChange = () => {
        setMode(mode === 'defined' ? 'open' : 'defined');
    };

    const [mode, setMode] = useState('defined');

    useEffect(() => {
        if (fieldValue && toggleMode && staticValues.indexOf(fieldValue) < 0) {
            toggleMode('open');
        }
    }, [fieldValue, staticValues, toggleMode]);

    return (
        <Container fluid>
            <Row gutters>
                <Col n="12 xl-9">
                    {cloneElement(children, {
                        ...children.props,
                        mode,
                    })}
                </Col>
                <Col n="12 xl-3">
                    <Container fluid>
                        <Row>
                            <Col>
                                <Toggle
                                    description="pour les dates antérieures à 1930"
                                    onChange={(e) => onToggleChange(e)}
                                    checked={mode === 'open'}
                                    label="Mode libre"
                                />
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}
