import { idToPrint } from '../../helpers/utils';

const ToPrint = ({ children }) => {
    return <section id={idToPrint}>{children}</section>;
};

export default ToPrint;
