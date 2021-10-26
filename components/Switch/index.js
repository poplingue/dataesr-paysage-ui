import CustomDate from '../CustomDate';
import CustomInput from '../CustomInput';
import CustomRadio from '../CustomRadio';
import CustomSelect from '../CustomSelect';
import CustomToggle from '../CustomToggle';
import MultiSearch from '../MultiSearch';

export default function Switch({
    type,
    title,
    infinite,
    staticValues,
    keynumber,
    section,
}) {
    const renderSwitch = type => {
        switch (type) {
            case 'text':
                return (
                    <CustomInput
                        title={title}
                        infinite={infinite}
                        keynumber={keynumber}
                        parentsection={section}
                    />
                );
            case 'select':
                return (
                    <CustomSelect
                        title={title}
                        staticValues={staticValues}
                        keynumber={keynumber}
                        parentsection={section}
                    />
                );
            case 'multiSearch':
                return (
                    <MultiSearch
                        title={title}
                        keynumber={keynumber}
                        parentsection={section}
                    />
                );
            case 'radio':
                return (
                    <CustomRadio
                        title={title}
                        staticValues={staticValues}
                        keynumber={keynumber}
                        parentsection={section}
                    />
                );
            case 'date':
                return (
                    <CustomDate
                        title={title}
                        parentsection={section}
                        keynumber={keynumber}
                    />
                );
            case 'toggle':
                return (
                    <CustomToggle
                        title={title}
                        keynumber={keynumber}
                        parentsection={section}
                    />
                );
            default:
                return null;
        }
    };

    return renderSwitch(type);
}
