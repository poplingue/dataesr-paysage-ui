import React from "react";
import renderer from "react-test-renderer";

import List from "../../components/List";

it("renders correctly List", () => {
  const tree = renderer
    .create(
      <List>
        <p>child</p>
      </List>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
