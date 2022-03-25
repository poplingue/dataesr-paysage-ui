import { Toggle } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import {
    arrayContains,
    getFieldValue,
    getFormName,
    getUniqueId,
    isNumber,
} from '../../helpers/utils';
import CustomInput from '../CustomInput';
import CustomSelect from '../CustomSelect';

export default function ToggleMode({
    selectedValue,
    onChange,
    updateValidSection,
    options,
    regex,
    fieldId,
    title,
    validatorId,
    subObject,
    newValueCheck,
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
    const [mode, setMode] = useState('defined');
    const [init, setInit] = useState(true);

    const onToggleChange = () => {
        setMode(mode === 'defined' ? 'open' : 'defined');
    };

    useEffect(() => {
        // TODO refacto
        const currentDateValue = fieldValue.match(regex) || [];

        if (
            fieldValue &&
            !arrayContains(options, currentDateValue[0]) &&
            isNumber(currentDateValue[0])
        ) {
            setMode('open');
        } else if (init && arrayContains(options, currentDateValue[0])) {
            setMode('defined');
        }

        setInit(false);
    }, [fieldValue, regex, options, setMode]);

    const renderInputs = () => {
        if (mode !== 'defined') {
            return (
                <CustomInput
                    customOnChange={(...params) =>
                        onChange(regex, fieldId, params)
                    }
                    updateValidSection={updateValidSection}
                    title={title}
                    validatorId={fieldId}
                    value={selectedValue}
                    subObject={subObject}
                    infinite={false}
                    suggest={false}
                />
            );
        } else {
            return (
                <CustomSelect
                    customOnChange={(...params) =>
                        onChange(regex, fieldId, params)
                    }
                    updateValidSection={updateValidSection}
                    title={title}
                    validatorId={fieldId}
                    staticValues={options}
                    newValue={selectedValue}
                    newValueCheck={newValueCheck}
                    subObject={subObject}
                />
            );
        }
    };

    return (
        <Container fluid>
            <Row gutters>
                <Col n="12 xl-12">{renderInputs()}</Col>
                {mode === 'open' ? 'open' : 'defined'}
                {title === 'Année' && (
                    <Col n="12 xl-12">
                        <Toggle
                            description="pour les dates antérieures à 1930"
                            onChange={onToggleChange}
                            checked={mode === 'open'}
                            label="Mode libre"
                        />
                    </Col>
                )}
            </Row>
        </Container>
    );
}
