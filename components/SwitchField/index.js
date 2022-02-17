import { useRouter } from 'next/router';
import { configValidators } from '../../helpers/constants';
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
    infinite,
    staticValues,
    index,
    section,
    updateValidSection,
    subObject,
}) {
    const {
        query: { object },
    } = useRouter();
    const validatorConfig = object
        ? configValidators[object][validatorId]
        : null;

    const renderSwitch = (type) => {
        switch (type) {
            case 'text':
                return (
                    <CustomInput
                        updateValidSection={updateValidSection}
                        title={title}
                        validatorId={validatorId}
                        value={value}
                        infinite={infinite}
                        section={section}
                        subObject={subObject}
                    />
                );
            case 'select':
                return (
                    <CustomSelect
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
                        updateValidSection={updateValidSection}
                        title={title}
                        validatorId={validatorId}
                        subObject={subObject}
                    />
                );
            case 'radio':
                return (
                    <CustomRadio
                        updateValidSection={updateValidSection}
                        title={title}
                        validatorId={validatorId}
                        staticValues={staticValues}
                        index={index}
                        subObject={subObject}
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
                        updateValidSection={updateValidSection}
                        title={title}
                        validatorId={validatorId}
                        index={index}
                        subObject={subObject}
                    />
                );
            case 'checkbox':
                return (
                    <CustomCheckbox
                        updateValidSection={updateValidSection}
                        staticValues={staticValues}
                        title={title}
                        validatorId={validatorId}
                        index={index}
                        subObject={subObject}
                    />
                );
            default:
                return `Validator ${validatorId} config is missing`;
        }
    };

    return renderSwitch(validatorConfig ? type : null);
}
