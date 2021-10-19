import { Col, Container, Icon, Row, SideMenu, SideMenuLink, Text } from '@dataesr/react-dsfr';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import { sectionUniqueId } from '../../helpers/utils';
import styles from './SideNavigation.module.scss';

export default function SideNavigation({ children, items }) {
    const goToSection = (e, dataSection) => {
        const section = document.querySelector(`[data-section=${dataSection}]`);
        const { left, top } = section.getBoundingClientRect();
        window.scrollTo(left, top + window.scrollY);
    };

    const { stateList: { sideMode }, dispatchList: dispatch } = useContext(AppContext);

    return (<Container>
        <Row>
            <Col n={`12 ${sideMode ? 'md-1' : 'md-4'}`}>
                <SideMenu
                    buttonLabel='Navigation'
                    className="fr-sidemenu--sticky">
                    <li>
                        <input type="checkbox" id="isCollapsed" className="hidden"
                               onClick={() => dispatch({
                                   type: 'UPDATE_SIDE_NAVIGATION_MODE',
                                   payload: {
                                       sideMode: !sideMode,
                                   }
                               })}
                        />
                        <div className={`${styles.SideNav} ${sideMode ? '' : styles.Active}`}>
                            <label htmlFor="isCollapsed">
                                <Icon name={sideMode ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'} size="lg"
                                      className={`${styles.Icon} ${sideMode ? styles.Active : ''} marianne`}/>
                                <Text className={`${sideMode ? 'hidden' : ''} marianne`} as="span" size="lg">Navigation</Text>
                            </label>
                            <ul className={`${styles.SideNavContent} ${!sideMode && styles.Active}`}>
                                {items.map((section) => {
                                    const { title, content } = section;

                                    return <SideMenuLink
                                        className={sideMode ? 'hidden' : ''}
                                        onClick={(e) => goToSection(e, sectionUniqueId(title, content.length))}
                                        href="/"
                                        key={`${title}-${content.length}`}>{title}</SideMenuLink>;
                                })}
                            </ul>
                        </div>
                    </li>
                </SideMenu>
            </Col>
            <Col n={`12 ${sideMode ? 'md-11' : 'md-8'}`}>
                {children}
            </Col>
        </Row>
    </Container>);
}
