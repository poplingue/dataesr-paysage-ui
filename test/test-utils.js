import { render } from '@testing-library/react';
import React from 'react';
import { AppContext } from '../context/GlobalState';

const Providers = ({ children }) => {

    return <AppContext.Provider value={{
        state: {
            darkTheme: false,
            storeObjects: ['person/create'],
            objectStoreName: 'person/create',
            departments: [],
            formName: 'person/create',
            forms: {
                'person/create': {
                    'person/create@section/infinite#0': 'test 1',
                    'person/create@section/infinite#1': 'test 2',
                    'person/create@section/infinite#2': 'test 3'
                }, 'structure/create': {}
            }
        }

    }}>{children}</AppContext.Provider>;
};
const customRender = (ui, options = {}) =>
    render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
