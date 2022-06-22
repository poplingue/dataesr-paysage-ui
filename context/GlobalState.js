import Cookies from 'js-cookie';
import React, { createContext, useEffect, useReducer } from 'react';
import DBService from '../services/DB.service';
import reducerForm from './ReducerForm';
import reducerList from './ReducerList';
import reducerPage from './ReducerPage';

export const AppContext = createContext();

export const DataProvider = ({ user, error, children }) => {
    // TODO refacto forms from { subObjects } from '../../config/objects';
    const initialStateForm = {
        darkTheme: false,
        storeObjects: [],
        objectFormType: '',
        validSections: [],
        departments: [],
        updateObjectId: Cookies.get('updateObjectId') || '',
        forms: [
            { 'contrib/person': [] },
            { 'contrib/structure': [] },
            { 'contrib/category': [] },
            { 'contrib/price': [] },
            { 'contrib/term': [] },
            { 'contrib/legalCategory': [] },
            { 'contrib/document': [] },
            { 'contrib/officialDocument': [] },
        ],
        savingSections: [],
        currentFormObject: {},
        dependencies: {},
        fieldsMode: {},
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
        tableData: [],
        accordionItems: [],
        modalDetail: {
            title: '',
            open: false,
            content: null,
        },
        hasBreadCrumbs: false,
        pageTheme: 'transparent',
        currentPageObject: {},
        error: error || null,
        user: user || {},
        userConnected: user && Object.keys(user).length > 0,
        identifiers: [],
    };

    const [stateForm, dispatchForm] = useReducer(reducerForm, initialStateForm);
    const [stateList, dispatchList] = useReducer(reducerList, initialStateList);
    const [statePage, dispatchPage] = useReducer(reducerPage, initialStatePage);

    const cbInit = (storeObjects) => {
        dispatchForm({
            type: 'UPDATE_INDB_STORE_OBJECTS',
            payload: { storeObjects },
        });
    };

    useEffect(() => {
        // TODO refacto forms from { subObjects } from '../../config/objects';
        DBService.init(
            [
                'contrib/person',
                'contrib/structure',
                'contrib/category',
                'contrib/officialDocument',
                'contrib/price',
                'contrib/document',
                'contrib/legalCategory',
                'contrib/term',
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
