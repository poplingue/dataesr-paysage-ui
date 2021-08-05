import React, { createContext, useReducer } from 'react';
import reducers from './Reducers';
import DBService from '../services/DBService';
import { useEffect, useContext } from 'react';

export const AppContext = createContext();

export const DataProvider = ({ children }) => {
    const initialState = {
        darkTheme: false,
        storeObjects: [],
        objectStoreName: '',
        forms: { 'person': {}, 'structure': {} }
    };
    const [state, dispatch] = useReducer(reducers, initialState);
    const cbInit = (storeObjects) => {
        dispatch({ type: 'UPDATE_INDB_STORE_OBJECTS', payload: { storeObjects } });
    };
    useEffect(() => {
        DBService.init(['person', 'structure'], cbInit);
    }, []);
    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};