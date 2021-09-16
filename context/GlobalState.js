import React, { createContext, useEffect, useReducer } from 'react';
import DBService from '../services/DBService';
import reducers from './Reducers';

export const AppContext = createContext();

export const DataProvider = ({ children }) => {
    const initialState = {
        darkTheme: false,
        storeObjects: [],
        departments: [],
        forms: [{ 'create/person': [] }, { 'create/structure': [] }]
    };
    const [state, dispatch] = useReducer(reducers, initialState);

    const cbInit = (storeObjects) => {
        dispatch({ type: 'UPDATE_INDB_STORE_OBJECTS', payload: { storeObjects } });
    };

    useEffect(() => {
        DBService.init(['create/person', 'create/structure'], cbInit);
    }, []);

    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};
