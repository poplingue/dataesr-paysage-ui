import { Icon, Tile, TileBody } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import grid from '../../helpers/imports';

export default function TileElement({
    color,
    title,
    subTitle,
    body,
    onClick,
    href,
    icon,
}) {
    const { Col, Row, Container } = grid();

    return (
        <Tile color={color} className="w-100" horizontal onClick={onClick}>
            <TileBody title={title} description={subTitle} linkHref={href}>
                <Container fluid className="w-100">
                    <Row alignItems="top">
                        <Col n="11">
                            <div>{body}</div>
                        </Col>
                        {onClick ||
                            (href && (
                                <Col n="1" className="txt-right">
                                    <Icon name={icon} size="xl" color={color} />
                                </Col>
                            ))}
                    </Row>
                </Container>
            </TileBody>
        </Tile>
    );
}

TileElement.defaultProps = {
    color: '#000091',
    href: '',
    onClick: null,
    checked: false,
    icon: 'ri-focus-2-fill',
};
TileElement.propTypes = {
    color: PropTypes.string,
    href: PropTypes.string,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    subTitle: PropTypes.string,
    onClick: PropTypes.func,
    checked: PropTypes.bool,
    icon: PropTypes.string,
};
