import preloadAll from 'jest-next-dynamic';
import * as nextRouter from 'next/router';
import React from 'react';
// Using render and screen from test-utils.js instead of
// @testing-library/react
import CustomRadio from '../../components/CustomRadio';
import { render, screen } from '../test-utils';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
    route: '/contrib/structure',
    pathname: '/contrib/[object]',
    query: { object: 'structure' },
}));

describe('Custom Radio', () => {
    beforeAll(async () => {
        await preloadAll();
    });

    it('should render the title', () => {
        render(
            <CustomRadio
                subObject="identifiers#K7L3c9M5"
                validatorId="active"
                updateValidSection={() => {}}
                title="Radio Star"
                section="Section"
                staticValues={[
                    { labelValue: '1', value: '1' },
                    { labelValue: '2', value: '2' },
                ]}
            />
        );

        const radio = screen.getByText('Radio Star');

        // we can only use toBeInTheDocument because it was imported
        // in the jest.setup.js and configured in jest.setup.js
        expect(radio).toBeInTheDocument();
    });
});
