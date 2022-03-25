import { Checkbox } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import {
    arrayContains,
    getFieldValue,
    getFormName,
    getUniqueId,
} from '../../helpers/utils';
import Input from '../CustomInput/Input';
import CustomSelect from '../CustomSelect';

export default function DateBlock({
    data: fieldsData,
    subObject,
    updateDate,
    newValueCheck,
    validatorId,
    updateValidSection,
    setNewValueCheck,
    years,
}) {
    const { Col, Container, Row } = grid();

    const {
        stateForm: { forms, fieldsMode },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId);
    const dateValue = useMemo(
        () => getFieldValue(forms, formName, uid) || 'yyyy-mm-dd',
        [formName, forms, uid]
    );

    const onChange = useCallback(
        async (regex, fieldId, params) => {
            const [value, updateCheck] = params;

            const reg = new RegExp(regex);
            const newValue = dateValue.replace(reg, value);
            const currentDateValue = dateValue.match(reg);
            const fieldUid = getUniqueId(formName, subObject, fieldId);
            const currentFieldValue = getFieldValue(forms, formName, fieldUid);

            // Save full date xxxx-xx-xx
            if (currentDateValue && currentDateValue[0] !== value) {
                await updateDate({
                    value: newValue,
                    uid,
                    formName,
                    unSaved: true,
                });
            }

            // Save field (day, month or year)
            if (currentFieldValue !== value) {
                await updateDate({
                    value,
                    uid: fieldUid,
                    formName,
                    unSaved: true,
                });
            }

            if (updateCheck !== undefined) {
                setNewValueCheck(updateCheck);
            }
        },
        [
            dateValue,
            formName,
            forms,
            setNewValueCheck,
            subObject,
            uid,
            updateDate,
        ]
    );

    const onToggleChange = (currentUID, m) => {
        const year = getFieldValue(forms, formName, currentUID);
        const check = arrayContains(years, year);
        const mode = check ? 'select' : 'input';

        if (m !== undefined) {
            // case update by value
            if (fieldsMode[currentUID]) {
                dispatch({
                    type: 'UPDATE_FIELDS_MODE',
                    payload: { [currentUID]: { mode: m } },
                });
            }
        } else {
            // case onClick checkbox
            if (Object.keys(fieldsMode).length > 0 && fieldsMode[currentUID]) {
                // case update value on init form
                dispatch({
                    type: 'UPDATE_FIELDS_MODE',
                    payload: {
                        [currentUID]: {
                            mode:
                                fieldsMode[currentUID].mode === 'input'
                                    ? 'select'
                                    : 'input',
                        },
                    },
                });
            }
        }
    };

    const renderInputs = () => {
        return fieldsData.map((input) => {
            let open = false;
            const { selectedValue, options, regex, fieldId, title } = input;
            const inputUID = getUniqueId(formName, subObject, fieldId);

            if (Object.keys(fieldsMode).length > 0 && fieldsMode[inputUID]) {
                open = fieldsMode[inputUID].mode === 'input';
            }

            if (open) {
                return (
                    <Col n="12 xl-4" key={title} spacing="py-1w">
                        <Input
                            customOnChange={(...params) =>
                                onChange(regex, fieldId, params)
                            }
                            updateValidSection={updateValidSection}
                            validatorId={fieldId}
                            value={selectedValue}
                            subObject={subObject}
                            label={title}
                            onToggleChange={
                                title === 'Année' ? onToggleChange : undefined
                            }
                        />
                    </Col>
                );
            } else {
                return (
                    <Col n="12 xl-4" key={title} spacing="py-1w">
                        <CustomSelect
                            onToggleChange={
                                title === 'Année' ? onToggleChange : undefined
                            }
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
                        {title === 'Année' && (
                            <Checkbox
                                size="sm"
                                label="champs libre"
                                value=""
                                checked={open}
                                onChange={() => onToggleChange(inputUID)}
                            />
                        )}
                    </Col>
                );
            }
        });
    };

    return (
        <Container fluid>
            <Row gutters>{renderInputs()}</Row>
        </Container>
    );
}
