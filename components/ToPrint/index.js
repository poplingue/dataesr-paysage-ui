import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import { cleanedPrintPage, idToPrint } from '../../helpers/utils';

const ToPrint = ({ children }) => {
    const { dispatchPage: dispatch } = useContext(AppContext);

    useEffect(() => {
        const printPage = cleanedPrintPage(idToPrint);

        dispatch({
            type: 'UPDATE_PRINT_PAGE',
            payload: {
                printPage,
            },
        });
    }, [dispatch]);

    return <section id={idToPrint}>{children}</section>;
};

export default ToPrint;
