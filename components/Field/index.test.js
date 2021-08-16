import React from 'react';
import { render, screen } from '../../test/test-utils';
import Field from './index';
import * as nextRouter from 'next/router';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/person/create', pathname: '/person/create' }));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

describe('Field component', () => {
    const setState = jest.fn();

    beforeEach(() => {
        React.useState.mockImplementation(init => [init, setState]);
        render(<Field
            label="Field"
            index={1}
            parentsection="Section"
            title="Field"
            value="Content field"
        ><p>Test</p></Field>);
    });

    it('should render the Delete field button', () => {
        expect(screen.getByTestId('btn-delete')).toBeVisible();
    });
});
