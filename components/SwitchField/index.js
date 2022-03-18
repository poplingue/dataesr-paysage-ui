import { useRouter } from 'next/router';
import { configValidators } from '../../config/objects';
import { getSubObjectType } from '../../helpers/utils';
import CustomCheckbox from '../CustomCheckbox';
import CustomDate from '../CustomDate';
import CustomInput from '../CustomInput';
import CustomRadio from '../CustomRadio';
import CustomSelect from '../CustomSelect';
import CustomToggle from '../CustomToggle';
import MultiSearch from '../MultiSearch';

export default function SwitchField({
    type,
    value,
    validatorId,
    title,
    suggest,
    onGroupChange,
    infinite,
    staticValues,
    section,
    updateValidSection,
    subObject,
    hint,
    defaultLabel,
}) {
    const {
        query: { object },
    } = useRouter();

    const validatorConfig = configValidators[object][
        getSubObjectType(subObject)
    ]
        ? configValidators[object][getSubObjectType(subObject)][validatorId]
        : null;

    const renderSwitch = (type) => {
        switch (type) {
            case 'text':
                return (
                    <CustomInput
                        onGroupChange={onGroupChange}
                        updateValidSection={updateValidSection}
                        title={title}
                        hint={hint}
                        validatorId={validatorId}
                        value={value}
                        infinite={infinite}
                        section={section}
                        subObject={subObject}
                        suggest={suggest}
                    />
                );
            case 'select':
                return (
                    <CustomSelect
                        onGroupChange={onGroupChange}
                        newValue={value}
                        updateValidSection={updateValidSection}
                        title={title}
                        validatorId={validatorId}
                        staticValues={staticValues}
                        subObject={subObject}
                    />
                );
            case 'multiSearch':
                return (
                    <MultiSearch
                        onGroupChange={onGroupChange}
                        updateValidSection={updateValidSection}
                        title={title}
                        validatorId={validatorId}
                        subObject={subObject}
                    />
                );
            case 'radio':
                return (
                    <CustomRadio
                        onGroupChange={onGroupChange}
                        updateValidSection={updateValidSection}
                        title={title}
                        hint={hint}
                        validatorId={validatorId}
                        staticValues={staticValues}
                        subObject={subObject}
                        defaultLabel={defaultLabel}
                    />
                );
            case 'date':
                return (
                    <CustomDate
                        validatorId={validatorId}
                        updateValidSection={updateValidSection}
                        title={title}
                        subObject={subObject}
                    />
                );
            case 'toggle':
                return (
                    <CustomToggle
                        onGroupChange={onGroupChange}
                        updateValidSection={updateValidSection}
                        title={title}
                        validatorId={validatorId}
                        subObject={subObject}
                    />
                );
            case 'checkbox':
                return (
                    <CustomCheckbox
                        onGroupChange={onGroupChange}
                        updateValidSection={updateValidSection}
                        staticValues={staticValues}
                        title={title}
                        hint={hint}
                        validatorId={validatorId}
                        subObject={subObject}
                    />
                );
            default:
                return `Validator ${validatorId} config is missing`;
        }
    };

    return renderSwitch(validatorConfig ? type : null);
}
