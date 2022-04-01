import preloadAll from 'jest-next-dynamic';
import * as nextRouter from 'next/router';
import React from 'react';
// Using render and screen from test-utils.js instead of
// @testing-library/react
import InfiniteField from '../../components/InfiniteField';
import { render, screen } from '../test-utils';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
    route: '/contrib/structure',
    pathname: '/contrib/[object]',
    query: { object: 'structure' },
}));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

describe('InfiniteField component', () => {
    const setState = jest.fn();

    beforeAll(async () => {
        await preloadAll();
    });

    beforeEach(() => {
        React.useState.mockImplementation((init) => [init, setState]);
        render(
            <InfiniteField
                title="Infinite"
                section="Section"
                subObject="names"
                validatorId="usualName"
            >
                <p>Test</p>
            </InfiniteField>
        );
    });

    it('should render the Add button', () => {
        expect(screen.getByTestId('btn-add')).toBeVisible();
    });
});
