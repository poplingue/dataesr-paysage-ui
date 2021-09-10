import * as nextRouter from 'next/router';
import React from 'react';
import { getUniqueId } from '../../helpers/utils';
import { render, screen, fireEvent } from '../../test/test-utils';
import Input from './Input';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/person/create', pathname: '/person/create' }));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

describe('Field component', () => {
    const setState = jest.fn();
    let wrapper;

    beforeEach(() => {
        React.useState.mockImplementation(init => [init, setState]);
        wrapper = render(<Input
            keynumber={1}
            label="Label"
            parentsection="Section"
            title="Title"
            value="Content value"
        />);
    });

    it('should render the input label', () => {
        expect(screen.getByText('Label')).toBeVisible();
    });

    it('should fill the Input value', () => {
        expect(screen.getByDisplayValue('Content value')).toBeVisible();
    });

    it('should render the input label', () => {
        const uniqueId = getUniqueId('/person/create', 'Section', 'Title', 1);
        expect(screen.getByTestId('Title')).toHaveAttribute('data-field', uniqueId);
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
