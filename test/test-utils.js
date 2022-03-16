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
                    storeObjects: ['contrib/person'],
                    departments: [],
                    formName: 'contrib/person',
                    forms: {
                        'contrib/person': {
                            'contrib/person@section_infinite#0': 'test 1',
                            'contrib/person@section_infinite#1': 'test 2',
                            'contrib/person@section_infinite#2': 'test 3',
                        },
                        'contrib/structure': {},
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
