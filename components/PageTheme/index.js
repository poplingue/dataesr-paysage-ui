import { useContext, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import BorderPage from '../BorderPage';

export default function PageTheme({ children, color }) {
    const {
        statePage: { pageTheme },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    useEffect(() => {
        if (pageTheme !== color) {
            dispatch({ type: 'UPDATE_COLOR_THEME', payload: color });
        }
    }, [color, pageTheme, dispatch]);

    useEffect(() => {
        dispatch({ type: 'UPDATE_COLOR_THEME', payload: 'transparent' });
    }, [dispatch]);

    return (
        <>
            <BorderPage color={color} />
            {children}
        </>
    );
}
