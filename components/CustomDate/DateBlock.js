import { useRouter } from 'next/router';
import { useCallback, useContext, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { getFieldValue, getFormName, getUniqueId } from '../../helpers/utils';
import Input from '../CustomInput/Input';
import CustomSelect from '../CustomSelect';
import ToggleMode from './ToggleMode';

export default function DateBlock({
    data: fieldsData,
    subObject,
    updateDate,
    newValueCheck,
    validatorId,
    updateValidSection,
    setNewValueCheck,
}) {
    const { Col, Container, Row } = grid();

    const {
        stateForm: { forms, fieldsMode },
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
            const [value, options] = params;
            const { updateCheck = undefined, fullDateOnly = false } = options;

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
            if (currentFieldValue !== value && !fullDateOnly) {
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

    const renderInputs = () => {
        return fieldsData.map((input) => {
            const { selectedValue, options, regex, fieldId, title } = input;
            const inputUID = getUniqueId(formName, subObject, fieldId);
            let inputMode = false;

            if (Object.keys(fieldsMode).length > 0 && fieldsMode[inputUID]) {
                inputMode = fieldsMode[inputUID].mode === 'input';
            }

            return (
                <Col n="12 xl-4" key={title}>
                    <ToggleMode
                        subObject={subObject}
                        inputMode={inputMode}
                        uid={inputUID}
                        active={title === 'Année'}
                    >
                        {inputMode ? (
                            <Input
                                customOnChange={(...params) =>
                                    onChange(regex, fieldId, params)
                                }
                                updateValidSection={updateValidSection}
                                validatorId={fieldId}
                                value={selectedValue}
                                subObject={subObject}
                                label={title}
                            />
                        ) : (
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
                        )}
                    </ToggleMode>
                </Col>
            );
        });
    };

    return (
        <Container fluid>
            <Row gutters>{renderInputs()}</Row>
        </Container>
    );
}
