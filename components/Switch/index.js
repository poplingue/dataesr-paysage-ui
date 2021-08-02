import CustomInput from '../CustomInput';
import CustomSelect from '../CustomSelect';
import CustomRadio from '../CustomRadio';
import MultiSearch from '../MultiSearch';

export default function Switch({ type, title, infinite, staticValues }) {
    const renderSwitch = (type) => {
        switch (type) {
            case 'text':
                return <CustomInput title={title} infinite={infinite}/>;
            case 'select':
                return <CustomSelect title={title} staticValues={staticValues}/>;
            case 'multiSearch':
                return <MultiSearch title={title}/>;
            case 'radio':
                return <CustomRadio title={title} staticValues={staticValues}/>;
            default:
                return null;
        }
    };
    return renderSwitch(type);
}
