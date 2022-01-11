import preloadAll from 'jest-next-dynamic';
import * as nextRouter from 'next/router';
import React from 'react';
// Using render and screen from test-utils.js instead of
// @testing-library/react
import CustomRadio from '../../components/CustomRadio';
import { render, screen } from '../test-utils';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({
    route: '/update/person',
    pathname: '/update/[object]',
    query: { object: 'person' },
}));

describe('Custom Radio', () => {
    beforeAll(async () => {
        await preloadAll();
    });

    it('should render the title', () => {
        render(
            <CustomRadio
                updateValidSection={() => {}}
                title="Radio Star"
                section="Section"
                staticValues={['1', '2']}
            />
        );

        const radio = screen.getByText('Radio Star');

        // we can only use toBeInTheDocument because it was imported
        // in the jest.setup.js and configured in jest.setup.js
        expect(radio).toBeInTheDocument();
    });
});
