import preloadAll from 'jest-next-dynamic';
import * as nextRouter from 'next/router';
import React from 'react';
import Field from '../../components/Field';
import { render, screen } from '../test-utils';
import '@testing-library/jest-dom/extend-expect';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
    route: '/update/person',
    pathname: '/update/person',
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
        // const setState = jest.fn();
        // React.useState.mockImplementation((init) => [init, setState]);
        // render(
        //     <Field
        //         label='Field'
        //         index={1}
        //         section='Section'
        //         title='Field'
        //         value='Content field'
        //     >
        //         <p>Test</p>
        //     </Field>,
        // );

        expect(screen.getByTestId('btn-delete-field')).toBeVisible();
    });
});
