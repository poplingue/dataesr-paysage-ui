import React, { createContext, useReducer } from 'react';
import reducers from './Reducers';
export const AppContext = createContext();

export const DataProvider = ({ children }) => {
    const initialState = { users: ['user1', 'user2'], darkTheme: true, forms: { 'person': {}, 'structure':{} }};
    const [state, dispatch] = useReducer(reducers, initialState);
    return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};