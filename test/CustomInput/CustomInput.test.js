import { fireEvent } from '@testing-library/react';
import * as nextRouter from 'next/router';
import React from 'react';
import Input from '../../components/CustomInput/Input';
import { getUniqueId } from '../../helpers/utils';
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
                infinite
                label="Label"
                value="Content value"
                subObject="subObject"
                validatorId="validator-infinite"
            />
        );
    });

    it('should render the input label', () => {
        expect(screen.getByText('Label')).toBeVisible();
    });

    it('should fill the Input value', () => {
        expect(screen.getByDisplayValue('Content value')).toBeVisible();
    });

    it('should have Title as data-field case infinite', () => {
        const uniqueId = getUniqueId(
            'update/person',
            'subObject',
            'validator-infinite',
            1
        );

        expect(screen.getByTestId('validator-infinite')).toHaveAttribute(
            'data-field',
            uniqueId
        );
    });

    it('should have Title as data-field', () => {
        const uniqueId = getUniqueId('update/person', 'subObject', 'validator');

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
                index={0}
                infinite={false}
                label="Label"
                value="Content value"
                subObject="subObject"
                validatorId="validator"
            />
        );

        expect(screen.getByTestId('validator')).toHaveAttribute(
            'data-field',
            uniqueId
        );
    });

    it('should change the Input value', () => {
        const input = screen.getByDisplayValue('Content value');
        fireEvent.change(input, {
            target: {
                value: 'New value',
            },
        });
        const newInput = screen.getByDisplayValue('Content value');
        expect(newInput).toBeVisible();
    });
});
