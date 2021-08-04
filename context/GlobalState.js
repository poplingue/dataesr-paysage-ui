import React, { createContext, useReducer } from 'react';
import reducers from './Reducers';
import DBService from '../services/DBService';
import { useEffect } from 'react';

export const AppContext = createContext();

export const DataProvider = ({ children }) => {
    useEffect(() => {
        DBService.init(['Person', 'Structure']);
    }, []);
    const initialState = {
        darkTheme: false,
        forms: { 'person': {}, 'structure': {} }
    };
    const [state, dispatch] = useReducer(reducers, initialState);
    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};