import GroupField from '../GroupField';
import SwitchField from '../SwitchField';

export default function WrapperFieldType({
    field,
    subObject,
    updateValidSection,
    newTitle,
}) {
    const {
        type: fieldType,
        infinite,
        hint,
        staticValues,
        validatorId,
        value,
        title,
        content,
    } = field;

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
            ></GroupField>
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
