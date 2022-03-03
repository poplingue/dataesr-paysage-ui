import { fireEvent } from '@testing-library/react';
import * as nextRouter from 'next/router';
import React from 'react';
import Input from '../../components/CustomInput/Input';
import { getUniqueId } from '../../helpers/utils';
import { render, screen } from '../test-utils';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
    route: '/update/structure',
    pathname: '/update/[object]',
    query: { object: 'structure' },
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
                subObject="names#K7L3c9M5"
                validatorId="shortName"
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
            'update/structure',
            'names#K7L3c9M5',
            'shortName',
            1
        );

        expect(screen.getByTestId('shortName')).toHaveAttribute(
            'data-field',
            uniqueId
        );
    });

    it('should have Title as data-field', () => {
        const uniqueId = getUniqueId(
            'update/structure',
            'names#K7L3c9M5',
            'othernames'
        );

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
                subObject="names#K7L3c9M5"
                validatorId="othernames"
            />
        );

        expect(screen.getByTestId('othernames')).toHaveAttribute(
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
