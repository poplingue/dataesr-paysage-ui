import * as nextRouter from 'next/router';
import React from 'react';
// Using render and screen from test-utils.js instead of
// @testing-library/react
import { render, screen } from '../test-utils';
import InfiniteField from '../../components/InfiniteField';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/create/person', pathname: '/create/[object]', query: {object: 'person'} }));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

describe('InfiniteField component', () => {
    const setState = jest.fn();
    beforeEach(() => {
        React.useState.mockImplementation(init => [init, setState]);
        render(<InfiniteField
            title="Infinite"
            parentsection="Section"
        ><p>Test</p></InfiniteField>);

    });

    it('should render the Add button', () => {
        expect(screen.getByTestId('btn-add')).toBeVisible();
    });

});