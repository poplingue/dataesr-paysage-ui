import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFormName, getUniqueId } from '../../helpers/utils';
import GroupField from '../GroupField';
import SwitchField from '../SwitchField';

export default function WrapperFieldType({
    field,
    subObject,
    updateValidSection,
    newTitle,
}) {
    const {
        stateForm: { dependencies },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        type: fieldType,
        infinite,
        hint,
        staticValues,
        validatorId,
        value,
        title,
        content,
        dependency,
    } = field;

    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);

    const groupField = (
        <GroupField
            hint={hint}
            validatorId={validatorId}
            content={content}
            updateValidSection={updateValidSection}
            subObject={subObject}
            section={newTitle}
            title={title}
        />
    );
    const switchField = (
        <SwitchField
            hint={hint}
            updateValidSection={updateValidSection}
            validatorId={validatorId}
            subObject={subObject}
            value={value}
            section={newTitle}
            type={fieldType}
            title={title}
            infinite={infinite}
            staticValues={staticValues}
        />
    );

    const wrapperFieldType = {
        true: () => groupField,
        false: () => switchField,
    };

    useEffect(() => {
        const check = !!dependencies[validatorId];

        // Handle dependencies of the current field
        if (dependency) {
            const { validatorId: minorValidationId, action, rule } = dependency;
            const uidMinor = getUniqueId(
                formName,
                subObject,
                minorValidationId
            );
            const uidMajor = getUniqueId(formName, subObject, validatorId);

            if (!dependencies[uidMinor] && !check) {
                dispatch({
                    type: 'UPDATE_FORM_DEPENDENCIES',
                    payload: {
                        [uidMinor]: {
                            action,
                            rule: rule || 'validator',
                            major: uidMajor,
                        },
                    },
                });
            }
        }
    }, [dependencies, dependency, dispatch, formName, subObject, validatorId]);

    return wrapperFieldType[fieldType === 'group']();
}
