import * as nextRouter from 'next/router';
import React from 'react';
// Using render and screen from test-utils.js instead of
// @testing-library/react
import { render, screen } from '../../test/test-utils';
import CustomRadio from './index';

nextRouter.useRouter = jest.fn();
nextRouter.useRouter.mockImplementation(() => ({ route: '/create/person', pathname:'/create/[object]', query: {object: 'person'} }));

describe('Custom Radio', () => {
    it('should render the title', () => {
        render(<CustomRadio
            title="Radio Star"
            parentsection="Section"
            staticValues={['1', '2']}/>);

        const radio = screen.getByText(
            /Radio Star/i
        );

        // we can only use toBeInTheDocument because it was imported
        // in the jest.setup.js and configured in jest.setup.js
        expect(radio).toBeInTheDocument();
    });
});
