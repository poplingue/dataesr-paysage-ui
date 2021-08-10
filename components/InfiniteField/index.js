import AddFieldButton from '../AddButton';
import { Col } from '@dataesr/react-dsfr';
import { useState, useContext, cloneElement, Children, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFormName, getUniqueId } from '../../helpers/utils';
import { useRouter } from 'next/router';

function InfiniteField({ children, title }) {
    const { state } = useContext(AppContext);
    const [number, setNumber] = useState(null);
    const router = useRouter();
    useEffect(() => {
        const initInfinite = Object.entries(state.forms[getFormName(router.pathname)]).filter(([k, v]) => k.startsWith(getUniqueId(router.pathname, title)));
        setNumber(initInfinite.length);
    }, [state.forms, router.pathname, title]);
    const plusOne = () => {
        setNumber(number + 1);
    };
    return (<Col n="12">
            {Array.apply(null, { length: number }).map((v, i) => {
                    return <div key={getUniqueId(router.pathname, title, i)}>
                        {Children.toArray(children).map(
                            (child) => cloneElement(child, { keyNumber: i }),
                        )}
                    </div>;
                }
            )}
            <Col>
                <AddFieldButton onClick={plusOne} title={title}/>
            </Col>
        </Col>
    );

}

export default InfiniteField;
