import { render } from '@testing-library/react';
import React from 'react';
import { AppContext } from '../context/GlobalState';

const Providers = (props, options) => {
    return (
        <AppContext.Provider
            value={{
                stateList: options.stateList || {
                    exportMode: true,
                },
                stateForm: options.stateForm || {
                    darkTheme: false,
                    storeObjects: ['update/person'],
                    departments: [],
                    formName: 'update/person',
                    forms: {
                        'update/person': {
                            'update/person@section/infinite#0': 'test 1',
                            'update/person@section/infinite#1': 'test 2',
                            'update/person@section/infinite#2': 'test 3',
                        },
                        'update/structure': {},
                    },
                },
                dispatchForm: () => {},
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

const customRender = (ui, options = {}) => {
    return render(ui, {
        wrapper: (props) => Providers(props, options),
        ...options,
    });
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
