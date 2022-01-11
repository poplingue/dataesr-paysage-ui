import preloadAll from 'jest-next-dynamic';
import React from 'react';

import TileElement from '../../components/TileElement';
import { fireEvent, render, screen } from '../test-utils';

describe('TileElement component', () => {
    let wrapper;

    beforeAll(async () => {
        await preloadAll();
    });

    beforeEach(() => {
        const func = () => {};

        wrapper = (context = {}, props) =>
            render(
                <TileElement
                    title={props.title}
                    body={props.body || 'body'}
                    subTitle={props.sub || 'subTitle'}
                    onClick={props.onClick || func}
                />,
                context
            );
    });

    it('renders correctly TileElement', () => {
        const props = { title: 'Title 0', checked: false };
        const tree = wrapper({ stateList: { exportMode: false } }, props);
        expect(tree).toMatchSnapshot();
    });

    it('should display Texts', () => {
        wrapper(
            { stateList: { exportMode: true } },
            {
                title: 'Title 1',
                body: 'Bobody',
                subTitle: 'subTitle',
            }
        );
        const title = screen.getByText('Title 1');
        const body = screen.getByText('Bobody');
        expect(title).toBeVisible();
        expect(body).toBeVisible();
    });

    it('should trigger onClick', () => {
        const mockClick = jest.fn();
        wrapper({}, { onClick: mockClick, title: 'Title' });
        const tile = screen.getByText('Title');
        fireEvent.click(tile, {});
        expect(mockClick).toHaveBeenCalledTimes(1);
    });
});
