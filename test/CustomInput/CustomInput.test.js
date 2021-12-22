import * as nextRouter from 'next/router';
import React from 'react';
import Input from '../../components/CustomInput/Input';
import { render, screen } from '../test-utils';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
    route: '/update/person',
    pathname: '/update/[object]',
    query: { object: 'person' },
}));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

describe('Field component', () => {
    const setState = jest.fn();
    let wrapper;

    beforeEach(() => {
        React.useState.mockImplementation((init) => [init, setState]);
        wrapper = render(
            <Input
                validatorConfig={{
                    required: true,
                    validators: [
                        (value) => ({
                            valid:
                                value.length > 2 &&
                                !!value.match(/^\d+(\.\d{1,2})?$/),
                            errorMsg:
                                '3 caractères minimum, uniquement numériques',
                        }),
                    ],
                }}
                index={1}
                label="Label"
                section="Section"
                title="Title"
                value="Content value"
            />
        );
    });

    it('should render the input label', () => {
        expect(screen.getByText('Label')).toBeVisible();
    });
    //
    // it('should fill the Input value', () => {
    //     expect(screen.getByDisplayValue('Content value')).toBeVisible();
    // });
    //
    // it('should have Title as data-field', () => {
    //     const uniqueId = getUniqueId('update/person', 'Section', 'Title', 1);
    //     expect(screen.getByTestId('Title')).toHaveAttribute(
    //         'data-field',
    //         uniqueId
    //     );
    // });
    //
    // it('should change the Input value', () => {
    //     const input = screen.getByDisplayValue('Content value');
    //     fireEvent.change(input, {
    //         target: {
    //             value: 'New value',
    //         },
    //     });
    //     const newInput = screen.getByDisplayValue('Content value');
    //     expect(newInput).toBeVisible();
    // });
});
