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
    sectionTitle,
}) {
    const {
        stateForm: { dependencies },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const {
        type: fieldType,
        suggest,
        infinite,
        hint,
        staticValues,
        validatorId,
        value,
        title,
        content,
        dependency,
        defaultLabel,
    } = field;

    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);

    const groupField = (
        <GroupField
            hint={hint}
            suggest={suggest}
            validatorId={validatorId}
            content={content}
            updateValidSection={updateValidSection}
            subObject={subObject}
            section={sectionTitle}
            title={title}
            infinite={infinite}
            defaultLabel={defaultLabel}
        />
    );
    const switchField = (
        <SwitchField
            hint={hint}
            suggest={suggest}
            updateValidSection={updateValidSection}
            validatorId={validatorId}
            subObject={subObject}
            value={value}
            section={sectionTitle}
            type={fieldType}
            title={title}
            infinite={infinite}
            defaultLabel={defaultLabel}
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
            const { validatorIds } = dependency;

            for (let i = 0; i < validatorIds.length; i = i + 1) {
                const { action, rule } = dependency;
                const minorValidationId = validatorIds[i];

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
        }
    }, [dependencies, dependency, dispatch, formName, subObject, validatorId]);

    return wrapperFieldType[fieldType === 'group']();
}
