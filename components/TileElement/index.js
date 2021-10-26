import { Col, Container, Icon, Row, Tile, TileBody } from "@dataesr/react-dsfr";
import PropTypes from "prop-types";
import { useContext } from "react";
import { AppContext } from "../../context/GlobalState";

export default function TileElement({
  color,
  title,
  subTitle,
  body,
  onClick,
  id,
  checked,
  defaultIcon
}) {
  const {
    stateList: { exportMode }
  } = useContext(AppContext);

  return (
    <Tile
      color={color}
      className="w-100"
      horizontal
      onClick={() => onClick(id)}
    >
      <TileBody title={title} description={subTitle}>
        <Container fluid className="w-100">
          <Row alignItems="top">
            <Col n="11">
              <div>{body}</div>
            </Col>
            <Col n="1" className="txt-right">
              {!exportMode && defaultIcon && (
                <Icon name={defaultIcon} size="2x" color={color} />
              )}
              {exportMode && (
                <>
                  {checked ? (
                    <Icon name="ri-checkbox-line" size="2x" color={color} />
                  ) : (
                    <Icon
                      name="ri-checkbox-blank-line"
                      size="2x"
                      color={color}
                    />
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </TileBody>
    </Tile>
  );
}

TileElement.defaultProps = {
  color: "#000091",
  defaultIcon: "",
  checked: false
};
TileElement.propTypes = {
  color: PropTypes.string,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  defaultIcon: PropTypes.string
};
