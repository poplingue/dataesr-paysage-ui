import React, { createContext, useEffect, useReducer } from 'react';
import DBService from '../services/DBService';
import reducersForm from './ReducersForm';
import reducersList from './ReducersList';
import reducersPage from './ReducersPage';

export const AppContext = createContext();

export const DataProvider = ({ children }) => {
    const initialState = {
        darkTheme: false,
        storeObjects: [],
        departments: [],
        forms: [{ 'create/person': [] }, { 'create/structure': [] }]
    };

    const initialStateList = {
        exportMode: false,
        selectionToExport: [],
    };

    const initialStatePage = {
        sideMode: 'on',
        hasBreadCrumbs: false,
        pageTheme: 'transparent',
    };

    const [stateForm, dispatchForm] = useReducer(reducersForm, initialState);
    const [stateList, dispatchList] = useReducer(reducersList, initialStateList);
    const [statePage, dispatchPage] = useReducer(reducersPage, initialStatePage);

    const cbInit = (storeObjects) => {
        dispatchForm({ type: 'UPDATE_INDB_STORE_OBJECTS', payload: { storeObjects } });
    };

    useEffect(() => {
        DBService.init(['create/person', 'create/structure'], cbInit);
    }, []);

    return <AppContext.Provider
        value={{ stateForm, dispatchForm, stateList, dispatchList, statePage, dispatchPage }}>{children}</AppContext.Provider>;
};
