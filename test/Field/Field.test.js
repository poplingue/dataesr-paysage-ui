import preloadAll from 'jest-next-dynamic';
import * as nextRouter from 'next/router';
import React from 'react';
import DeleteButton from '../../components/InfiniteAccordion/DeleteButton';
import Field from '../../components/InfiniteField/Field';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '../test-utils';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
    giroute: '/contrib/person',
    pathname: '/contrib/person',
}));

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useState: jest.fn(),
}));

describe('Field component', () => {
    beforeAll(async () => {
        await preloadAll();
    });

    const setState = jest.fn();

    beforeEach(() => {
        React.useState.mockImplementation((init) => [init, setState]);
        render(
            <Field
                deleteField={() => {}}
                label="Field"
                index={1}
                section="Section"
                title="Field"
                value="Content field"
            >
                <p>Test</p>
            </Field>
        );
    });

    it('should render the Delete field button', async () => {
        const setState = jest.fn();
        React.useState.mockImplementation((init) => [init, setState]);
        render(
            <DeleteButton display title="title" index={1} onClick={() => {}} />
        );

        expect(screen.getByTestId('btn-delete-title#1')).toBeVisible();
    });
});
