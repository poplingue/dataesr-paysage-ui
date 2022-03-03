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

    useEffect(() => {
        const check = !!dependencies[field.validatorId];

        // Handle dependencies of the current field
        if (dependency) {
            if (
                !dependencies[
                    getUniqueId(formName, subObject, dependency.validatorId)
                ] &&
                !check
            ) {
                dispatch({
                    type: 'UPDATE_FORM_DEPENDENCES',
                    payload: {
                        [getUniqueId(
                            formName,
                            subObject,
                            dependency.validatorId
                        )]: {
                            action: dependency.action,
                            major: getUniqueId(
                                formName,
                                subObject,
                                field.validatorId
                            ),
                        },
                    },
                });
            }
        }
    }, [
        dependencies,
        dispatch,
        field.dependency,
        field.validatorId,
        formName,
        subObject,
    ]);

    if (fieldType === 'group') {
        return (
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
    }

    return (
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
}
