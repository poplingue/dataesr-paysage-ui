import React, { createContext, useEffect, useReducer } from 'react';
import DBService from '../services/DB.service';
import reducersForm from './ReducersForm';
import reducersList from './ReducersList';
import reducersPage from './ReducersPage';

export const AppContext = createContext();

export const DataProvider = ({ user, error, children }) => {
    const initialState = {
        darkTheme: false,
        storeObjects: [],
        objectFormType: '',
        validSections: [],
        departments: [],
        updateObjectId: '',
        forms: [
            { 'update/person': [] },
            { 'update/structure': [] },
            { 'tests/structure': [] },
            { 'tests/person': [] },
        ],
    };

    const initialStateList = {
        exportMode: false,
        selectionToExport: [],
    };

    const initialStatePage = {
        sideMode: 'on',
        printPage: null,
        accordionSkeleton: [],
        hasBreadCrumbs: false,
        pageTheme: 'transparent',
        error: error || null,
        user: user || {},
        userConnected:
            (user && Object.keys(user).length > 0 && !user.error) || false,
    };

    const [stateForm, dispatchForm] = useReducer(reducersForm, initialState);
    const [stateList, dispatchList] = useReducer(
        reducersList,
        initialStateList
    );
    const [statePage, dispatchPage] = useReducer(
        reducersPage,
        initialStatePage
    );

    const cbInit = (storeObjects) => {
        dispatchForm({
            type: 'UPDATE_INDB_STORE_OBJECTS',
            payload: { storeObjects },
        });
    };

    useEffect(() => {
        DBService.init(
            [
                'update/person',
                'update/structure',
                'tests/person',
                'tests/structure',
            ],
            cbInit
        );
    }, []);

    return (
        <AppContext.Provider
            value={{
                stateForm,
                dispatchForm,
                stateList,
                dispatchList,
                statePage,
                dispatchPage,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
