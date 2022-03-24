import { useRouter } from 'next/router';
import { useCallback, useContext, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { getFieldValue, getFormName, getUniqueId } from '../../helpers/utils';
import CustomInput from '../CustomInput';
import CustomSelect from '../CustomSelect';

export default function DateBlock({
    data,
    mode,
    subObject,
    updateDate,
    newValueCheck,
    validatorId,
    updateValidSection,
    setNewValueCheck,
}) {
    const { Col, Container, Row } = grid();

    const {
        stateForm: { forms },
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId);
    const inputMode = useMemo(() => mode, [mode]);

    const onChange = useCallback(
        async (regex, fieldId, params) => {
            const [value, updateCheck] = params;
            const dateValue =
                getFieldValue(forms, formName, uid) || 'yyyy-mm-dd';
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
        [formName, forms, setNewValueCheck, subObject, uid, updateDate]
    );

    const renderInput = () => {
        return data.map((select) => {
            const { selectedValue, options, regex, fieldId, title } = select;

            if (title === 'Année' && inputMode === 'open') {
                return (
                    <Col n="12 xl-4" key={title}>
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
                    </Col>
                );
            }

            return (
                <Col n="12 xl-4" key={title} spacing="py-1w">
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
                </Col>
            );
        });
    };

    return (
        <Container fluid>
            <Row gutters>{renderInput()}</Row>
        </Container>
    );
}
