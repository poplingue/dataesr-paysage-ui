import { render } from '@testing-library/react';
import React from 'react';
import { AppContext } from '../context/GlobalState';

const Providers = ({ children }) => {

    return <AppContext.Provider value={{
        state: {
            darkTheme: false,
            storeObjects: ['create/person'],
            departments: [],
            formName: 'create/person',
            forms: {
                'create/person': {
                    'create/person@section/infinite#0': 'test 1',
                    'create/person@section/infinite#1': 'test 2',
                    'create/person@section/infinite#2': 'test 3'
                }, 'create/structure': {}
            }
        },
        dispatch: () => {
        }
    }
    }>{children}</AppContext.Provider>;
};
const customRender = (ui, options = {}) =>
    render(ui, { wrapper: Providers, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
