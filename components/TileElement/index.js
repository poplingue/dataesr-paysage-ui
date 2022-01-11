import { Icon, Tile, TileBody } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import dsfrGrid from '../../helpers/imports';

export default function TileElement({ color, title, subTitle, body, onClick }) {
    const { Col, Row, Container } = dsfrGrid();

    return (
        <Tile color={color} className="w-100" horizontal onClick={onClick}>
            <TileBody title={title} description={subTitle}>
                <Container fluid className="w-100">
                    <Row alignItems="top">
                        <Col n="11">
                            <div>{body}</div>
                        </Col>
                        {onClick && (
                            <Col n="1" className="txt-right">
                                <Icon
                                    name="ri-focus-2-fill"
                                    size="2x"
                                    color={color}
                                />
                            </Col>
                        )}
                    </Row>
                </Container>
            </TileBody>
        </Tile>
    );
}

TileElement.defaultProps = {
    color: '#000091',
    checked: false,
};
TileElement.propTypes = {
    color: PropTypes.string,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    checked: PropTypes.bool,
    defaultIcon: PropTypes.string,
};
