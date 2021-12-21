import {
    Icon,
    SideMenu,
    SideMenuItem,
    SideMenuLink,
    Text,
} from '@dataesr/react-dsfr';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { goToSection, sectionUniqueId } from '../../helpers/utils';
import useScroll from '../../hooks/useScroll';
import useViewport from '../../hooks/useViewport';
import styles from './SideNavigation.module.scss';

export default function Navigation({ items }) {
    const {
        statePage: { sideMode },
        dispatchPage: dispatch,
    } = useContext(AppContext);
    const { mobile } = useViewport();
    // TODO fix mobile sticky position too early
    const [sticky, setSticky] = useState(false);
    const [offsetTop, setOffsetTop] = useState(null);
    const [initOffsetTop, setInitOffsetTop] = useState(null);
    const { scrollTop, scrollingDown } = useScroll();

    useEffect(() => {
        if (!initOffsetTop) {
            setInitOffsetTop(ref.current.offsetTop);
            setOffsetTop(ref.current.offsetTop);
        }
    }, [initOffsetTop, offsetTop]);

    const handleScroll = useCallback(() => {
        if (scrollTop > offsetTop && scrollingDown) {
            setSticky(true);
        } else if (scrollTop < initOffsetTop && !scrollingDown) {
            setSticky(false);
        }
    }, [initOffsetTop, offsetTop, scrollTop, scrollingDown]);

    useEffect(() => {
        if (ref.current.offsetTop !== offsetTop) {
            setOffsetTop(ref.current.offsetTop);
        }

        handleScroll();
    }, [handleScroll, offsetTop]);
    const ref = useRef(null);
    const sideOpened = sideMode === 'on';

    return (
        <SideMenu
            ref={ref}
            buttonLabel="Navigation"
            id={mobile && sticky ? styles.Sticky : ''}
        >
            <li>
                <input
                    type="checkbox"
                    id="isCollapsed"
                    className="hidden"
                    onClick={() =>
                        dispatch({
                            type: 'UPDATE_SIDE_NAVIGATION_MODE',
                            payload: {
                                sideMode: sideOpened ? 'off' : 'on',
                            },
                        })
                    }
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
                                        className={sideOpened ? '' : 'hidden'}
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
                                                    onClick={(e) =>
                                                        goToSection(
                                                            e,
                                                            sectionUniqueId(
                                                                subSectionTitle
                                                            )
                                                        )
                                                    }
                                                    href=""
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
                                    onClick={(e) =>
                                        goToSection(
                                            e,
                                            sectionUniqueId(
                                                title,
                                                content.length
                                            )
                                        )
                                    }
                                    href=""
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
