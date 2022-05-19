import {
    Icon,
    SideMenu,
    SideMenuItem,
    SideMenuLink,
    Text,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { goToSection, sectionUniqueId } from '../../helpers/utils';
import useViewport from '../../hooks/useViewport';
import styles from './SideNavigation.module.scss';

export default function Navigation({ items, color }) {
    const {
        statePage: { sideMode },
        dispatchPage: dispatch,
    } = useContext(AppContext);
    const { mobile } = useViewport();
    const [offsetTop, setOffsetTop] = useState(null);
    const [initOffsetTop, setInitOffsetTop] = useState(null);

    useEffect(() => {
        if (!initOffsetTop) {
            setInitOffsetTop(ref.current.offsetTop);
            setOffsetTop(ref.current.offsetTop);
        }
    }, [initOffsetTop, offsetTop]);

    useEffect(() => {
        if (ref.current.offsetTop !== offsetTop) {
            setOffsetTop(ref.current.offsetTop);
        }
    }, [offsetTop]);
    const ref = useRef(null);
    const sideOpened = sideMode === 'on';

    const sideModeAction = () => {
        dispatch({
            type: 'UPDATE_SIDE_NAVIGATION_MODE',
            payload: {
                sideMode: sideOpened ? 'off' : 'on',
            },
        });
    };

    return (
        <SideMenu ref={ref} buttonLabel="Navigation">
            <li>
                <input
                    type="checkbox"
                    id="isCollapsed"
                    className="hidden"
                    onClick={sideModeAction}
                />
                <div
                    className={`${styles.SideNav} ${
                        sideOpened ? styles.Active : ''
                    }`}
                >
                    {!mobile && (
                        <label
                            htmlFor="isCollapsed"
                            className={`${styles.SideNavLabel} d-block txt-center`}
                            data-cy="nav-header-text"
                        >
                            <Icon
                                name={
                                    sideOpened
                                        ? 'ri-menu-fold-line'
                                        : 'ri-menu-unfold-line'
                                }
                                size="lg"
                                className={`${styles.Icon} ${
                                    sideOpened ? '' : styles.Active
                                } marianne`}
                            />
                            <Icon
                                name="ri-arrow-left-s-line"
                                iconPosition="right"
                                className={styles.Arrow}
                            >
                                <Text
                                    className={`${
                                        sideOpened ? '' : 'hidden'
                                    } marianne`}
                                    as="span"
                                    size="md"
                                >
                                    Navigation
                                </Text>
                            </Icon>
                        </label>
                    )}
                    <ul
                        className={`${styles.SideNavContent} ${
                            sideOpened ? styles.Active : ''
                        }`}
                    >
                        {items.map((section, i) => {
                            const { title, content, component } = section;

                            if (component && content.length > 0) {
                                return (
                                    <SideMenuItem
                                        key={title}
                                        className={
                                            sideOpened
                                                ? `${styles[color]}`
                                                : `${styles[color]} hidden`
                                        }
                                        title={title}
                                        expandedDefault
                                    >
                                        {content.map((subSection) => {
                                            const { title: subSectionTitle } =
                                                subSection;

                                            return (
                                                <SideMenuLink
                                                    className={`${
                                                        !sideOpened && 'hidden'
                                                    } marianne`}
                                                    onClick={() =>
                                                        goToSection(
                                                            sectionUniqueId(
                                                                subSectionTitle
                                                            )
                                                        )
                                                    }
                                                    href={`#${subSectionTitle}`}
                                                    key={subSectionTitle}
                                                >
                                                    {subSectionTitle}
                                                </SideMenuLink>
                                            );
                                        })}
                                    </SideMenuItem>
                                );
                            }

                            return (
                                <SideMenuLink
                                    className={sideOpened ? '' : 'hidden'}
                                    onClick={() =>
                                        goToSection(
                                            sectionUniqueId(
                                                title,
                                                content.length
                                            )
                                        )
                                    }
                                    href={`#${title}`}
                                    key={`${title}-${content.length}-${i}`}
                                >
                                    {title}
                                </SideMenuLink>
                            );
                        })}
                    </ul>
                </div>
            </li>
        </SideMenu>
    );
}

Navigation.defaultProps = {
    color: '',
};

Navigation.propTypes = {
    color: PropTypes.oneOf(['Yellow', 'Pink', 'Purple', 'Blue', 'Green', '']),
    items: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            content: PropTypes.arrayOf(
                PropTypes.shape({
                    title: PropTypes.string,
                    component: PropTypes.string,
                })
            ),
            component: PropTypes.string,
            print: PropTypes.bool,
        })
    ).isRequired,
};
