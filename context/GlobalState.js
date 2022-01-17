import React, { createContext, useEffect, useReducer } from 'react';
import DBService from '../services/DB.service';
import reducersForm from './ReducersForm';
import reducersList from './ReducersList';
import reducersPage from './ReducersPage';

export const AppContext = createContext();

export const DataProvider = ({ user, technicalError, children }) => {
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
            { 'demo/structure': [] },
            { 'demo/person': [] },
        ],
    };

    const initialStateList = {
        exportMode: false,
        selectionToExport: [],
    };

    const initialStatePage = {
        sideMode: 'on',
        spinner: false,
        printPage: null,
        accordionSkeleton: [],
        accordionItems: [],
        modalDetail: {
            title: '',
            open: false,
            content: null,
        },
        hasBreadCrumbs: false,
        pageTheme: 'transparent',
        error: technicalError || null,
        user: user || {},
        userConnected: (user && Object.keys(user).length > 0) || false,
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
                'demo/person',
                'demo/structure',
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
