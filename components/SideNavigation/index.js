import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import Navigation from './Navigation';

export default function SideNavigation({ children, items, color }) {
    const { Col, Row, Container } = grid();

    const {
        statePage: { sideMode },
    } = useContext(AppContext);
    const sideOpened = sideMode === 'on';

    return (
        <Container className="p-relative" fluid>
            <Row>
                <Col n={`12 ${sideOpened ? 'md-3' : 'md-1'}`}>
                    <Navigation items={items} color={color} />
                </Col>
                <Col n={`12 ${sideOpened ? 'md-9' : 'md-11'}`}>
                    <Container>
                        <Row>
                            <Col>{children}</Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}

SideNavigation.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            content: PropTypes.arrayOf(
                PropTypes.shape({
                    component: PropTypes.string,
                    title: PropTypes.string,
                })
            ),
            title: PropTypes.string,
        })
    ).isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
};
