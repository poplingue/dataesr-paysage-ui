import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import { configValidator as configValidatorPerson } from '../CreatePerson/configValidator';
import { configValidator as configValidatorStructure } from '../CreateStructure/configValidator';

import CustomCheckbox from '../CustomCheckbox';
import CustomDate from '../CustomDate';
import CustomInput from '../CustomInput';
import CustomRadio from '../CustomRadio';
import CustomSelect from '../CustomSelect';
import CustomToggle from '../CustomToggle';
import MultiSearch from '../MultiSearch';

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
                        value={value}
                        infinite={infinite}
                        index={index}
                        section={section}
                    />
                );
            case 'select':
                return (
                    <CustomSelect
                        updateValidSection={updateValidSection}
                        validatorConfig={validatorConfig}
                        title={title}
                        staticValues={staticValues}
                        index={index}
                        section={section}
                    />
                );
            case 'multiSearch':
                return (
                    <MultiSearch
                        updateValidSection={updateValidSection}
                        title={title}
                        index={index}
                        section={section}
                        validatorConfig={validatorConfig}
                    />
                );
            case 'radio':
                return (
                    <CustomRadio
                        updateValidSection={updateValidSection}
                        validatorConfig={validatorConfig}
                        title={title}
                        staticValues={staticValues}
                        index={index}
                        section={section}
                    />
                );
            case 'date':
                return (
                    <CustomDate
                        updateValidSection={updateValidSection}
                        validatorConfig={validatorConfig}
                        title={title}
                        section={section}
                        index={index}
                    />
                );
            case 'toggle':
                return (
                    <CustomToggle
                        updateValidSection={updateValidSection}
                        title={title}
                        index={index}
                        section={section}
                    />
                );
            case 'checkbox':
                return (
                    <CustomCheckbox
                        updateValidSection={updateValidSection}
                        validatorConfig={validatorConfig}
                        staticValues={staticValues}
                        title={title}
                        index={index}
                        section={section}
                    />
                );
            default:
                return 'Validator config is missing';
        }
    };

    return renderSwitch(validatorConfig ? type : null);
}
