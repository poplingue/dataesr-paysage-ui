import { Col, Container, Row } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import useViewport from '../../hooks/useViewport';
import Navigation from './Navigation';

export default function SideNavigation({ children, items }) {
    const { stateList: { sideMode }, dispatchList: dispatch } = useContext(AppContext);
    const { mobile } = useViewport();

    return (
        <Container fluid={!mobile}>
            <Row>
                <Col n={`12 ${sideMode ? 'md-1' : 'md-3'}`}>
                    <Navigation
                        sideMode={sideMode}
                        items={items}
                        dispatch={dispatch}/>
                </Col>
                <Col n={`12 ${sideMode ? 'md-11' : 'md-9'}`}>
                    {children}
                </Col>
            </Row>
        </Container>
    );
}


SideNavigation.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        content: PropTypes.arrayOf(PropTypes.shape({
            component: PropTypes.string,
            title: PropTypes.string
        })),
        title: PropTypes.string
    })).isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
};
