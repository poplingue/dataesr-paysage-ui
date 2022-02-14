import { Col } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFieldValue, getFormName, getUniqueId } from '../../helpers/utils';
import CustomSelect from '../CustomSelect';

export default function DateBlock({
    data,
    section,
    subObject,
    updateDate,
    newValueCheck,
    validatorId,
    updateValidSection,
    validatorConfig,
    setNewValueCheck,
}) {
    const {
        stateForm: { forms },
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId);

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

            console.log('==== ONCHANGE ==== ', value);

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

    return data.map((select) => {
        const { selectedValue, options, regex, fieldId, title } = select;

        return (
            <Col n="12 xl-4" key={title} spacing="py-1w">
                <CustomSelect
                    customOnChange={(...params) =>
                        onChange(regex, fieldId, params)
                    }
                    updateValidSection={updateValidSection}
                    validatorConfig={validatorConfig}
                    section={section}
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
}
