import React, { createContext, useReducer, useState } from 'react';
import reducers from './Reducers';
import DBService from '../services/DBService';
import { useEffect } from 'react';
import { getFormName } from '../helpers/utils';
import { useRouter } from 'next/router';

export const AppContext = createContext();

export const DataProvider = ({ children }) => {
    const { pathname } = useRouter();

    const initialState = {
        darkTheme: false,
        storeObjects: [],
        objectStoreName: '',
        departments: [],
        formName: '',
        forms: { 'person/create': {}, 'structure/create': {} }
    };
    const [state, dispatch] = useReducer(reducers, initialState);

    const cbInit = (storeObjects) => {
        dispatch({ type: 'UPDATE_INDB_STORE_OBJECTS', payload: { storeObjects } });
    };

    useEffect(() => {
        DBService.init(['person/create', 'structure/create'], cbInit);
    }, []);

    useEffect(() => {
        if (state.formName !== getFormName(pathname)) {
            state.formName = getFormName(pathname);
        }
    }, [pathname, state]);

    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};
