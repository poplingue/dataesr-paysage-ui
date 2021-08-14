import CustomInput from '../CustomInput';
import CustomSelect from '../CustomSelect';
import CustomRadio from '../CustomRadio';
import MultiSearch from '../MultiSearch';
import CustomDate from '../CustomDate';
import CustomToggle from '../CustomToggle';

export default function Switch({ type, title, infinite, staticValues, keyNumber, section }) {
    const renderSwitch = (type) => {
        switch (type) {
            case 'text':
                return <CustomInput
                    title={title}
                    infinite={infinite}
                    keyNumber={keyNumber}
                    parentSection={section}
                />;
            case 'select':
                return <CustomSelect
                    title={title}
                    staticValues={staticValues}
                    keyNumber={keyNumber}
                    parentSection={section}
                />;
            case 'multiSearch':
                return <MultiSearch
                    title={title}
                    keyNumber={keyNumber}
                    parentSection={section}
                />;
            case 'radio':
                return <CustomRadio
                    title={title}
                    staticValues={staticValues}
                    keyNumber={keyNumber}
                    parentSection={section}
                />;
            case 'date':
                return <CustomDate
                    title={title}
                    parentSection={section}
                    keyNumber={keyNumber}
                />;
            case 'toggle':
                return <CustomToggle
                    title={title}
                    keyNumber={keyNumber}
                    parentSection={section}
                />;
            default:
                return null;
        }
    };
    return renderSwitch(type);
}
