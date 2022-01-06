import { forwardRef, useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../context/GlobalState';

const Component = ({ children }) => {
    const printPageRef = useRef(null);
    const {
        stateForm: { printPage },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    useEffect(() => {
        if (printPageRef && printPage !== printPageRef.current) {
            dispatch({
                type: 'UPDATE_PRINT_PAGE',
                payload: {
                    printPage: printPageRef.current,
                },
            });
        }
    }, [dispatch, printPage]);

    return (
        <section ref={printPageRef} id="page-to-print">
            {children}
        </section>
    );
};

const ToPrint = forwardRef(Component);

export default ToPrint;
