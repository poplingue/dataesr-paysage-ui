import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';

import CustomCheckbox from '../CustomCheckbox';
import CustomDate from '../CustomDate';
import CustomInput from '../CustomInput';
import CustomRadio from '../CustomRadio';
import CustomSelect from '../CustomSelect';
import CustomToggle from '../CustomToggle';
import MultiSearch from '../MultiSearch';
import { configValidator as configValidatorPerson } from '../UpdatePerson/configValidator';
import { configValidator as configValidatorStructure } from '../UpdateStructure/configValidator';

const config = {
    structure: configValidatorStructure,
    person: configValidatorPerson,
};

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
        stateForm: { objectFormType },
    } = useContext(AppContext);
    const validatorConfig = objectFormType
        ? config[objectFormType][validatorId]
        : null;
    // TODO move updateValidSection to Global action?

    const renderSwitch = (type) => {
        switch (type) {
            case 'text':
                return (
                    <CustomInput
                        updateValidSection={updateValidSection}
                        validatorConfig={validatorConfig}
                        title={title}
                        validatorId={validatorId}
                        value={value}
                        infinite={infinite}
                        index={index}
                        section={section}
                        subObject={subObject}
                    />
                );
            case 'select':
                return (
                    <CustomSelect
                        newValue={value}
                        updateValidSection={updateValidSection}
                        validatorConfig={validatorConfig}
                        title={title}
                        validatorId={validatorId}
                        staticValues={staticValues}
                        section={section}
                        subObject={subObject}
                    />
                );
            case 'multiSearch':
                return (
                    <MultiSearch
                        updateValidSection={updateValidSection}
                        title={title}
                        validatorId={validatorId}
                        index={index}
                        section={section}
                        validatorConfig={validatorConfig}
                        subObject={subObject}
                    />
                );
            case 'radio':
                return (
                    <CustomRadio
                        updateValidSection={updateValidSection}
                        validatorConfig={validatorConfig}
                        title={title}
                        validatorId={validatorId}
                        staticValues={staticValues}
                        index={index}
                        section={section}
                        subObject={subObject}
                    />
                );
            case 'date':
                return (
                    <CustomDate
                        validatorId={validatorId}
                        updateValidSection={updateValidSection}
                        validatorConfig={validatorConfig}
                        title={title}
                        section={section}
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
                        section={section}
                        subObject={subObject}
                    />
                );
            case 'checkbox':
                return (
                    <CustomCheckbox
                        updateValidSection={updateValidSection}
                        validatorConfig={validatorConfig}
                        staticValues={staticValues}
                        title={title}
                        validatorId={validatorId}
                        index={index}
                        section={section}
                        subObject={subObject}
                    />
                );
            default:
                return 'Validator config is missing';
        }
    };

    return renderSwitch(validatorConfig ? type : null);
}
