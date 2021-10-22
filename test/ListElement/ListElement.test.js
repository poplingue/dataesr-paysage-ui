import React from 'react';
import renderer from 'react-test-renderer';

import ListElement from '../../components/ListElement';

it('renders correctly List', () => {
    const tree = renderer.create(<ListElement><p>child</p></ListElement>).toJSON();
    expect(tree).toMatchSnapshot();
});
