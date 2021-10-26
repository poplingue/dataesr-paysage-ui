import {
    Icon,
    SideMenu,
    SideMenuItem,
    SideMenuLink,
    Text,
} from '@dataesr/react-dsfr'
import { useCallback, useEffect, useRef, useState } from 'react'
import { sectionUniqueId } from '../../helpers/utils'
import useScroll from '../../hooks/useScroll'
import useViewport from '../../hooks/useViewport'
import styles from './SideNavigation.module.scss'

export default function Navigation({ sideMode, dispatch, items }) {
    const { mobile } = useViewport()
    const [sticky, setSticky] = useState(false)
    const [offsetTop, setOffsetTop] = useState(null)
    const [initOffsetTop, setInitOffsetTop] = useState(null)
    const { scrollTop, scrollingDown } = useScroll()

    const goToSection = (e, dataSection) => {
        const section = document.querySelector(`[data-section=${dataSection}]`)
        const { left, top } = section.getBoundingClientRect()
        window.scrollTo(left, top + window.scrollY)
    }

    useEffect(() => {
        if (!initOffsetTop) {
            setInitOffsetTop(ref.current.offsetTop)
            setOffsetTop(ref.current.offsetTop)
        }
    }, [initOffsetTop, offsetTop])

    const handleScroll = useCallback(() => {
        if (scrollTop > offsetTop && scrollingDown) {
            setSticky(true)
        } else if (scrollTop < initOffsetTop && !scrollingDown) {
            setSticky(false)
        }
    }, [initOffsetTop, offsetTop, scrollTop, scrollingDown])

    useEffect(() => {
        if (ref.current.offsetTop !== offsetTop) {
            setOffsetTop(ref.current.offsetTop)
        }

        handleScroll()
    }, [handleScroll, offsetTop])
    const ref = useRef(null)

    return (
        <SideMenu
            id={mobile && sticky ? styles.Sticky : ''}
            ref={ref}
            buttonLabel="Navigation"
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
                                sideMode: sideMode === 'on' ? 'off' : 'on',
                            },
                        })
                    }
                />
                <div
                    className={`${styles.SideNav} ${
                        sideMode === 'on' ? '' : styles.Active
                    }`}
                >
                    {!mobile && (
                        <label
                            htmlFor="isCollapsed"
                            className={`${
                                styles.SideNavLabel
                            } d-block txt-center`}
                            data-cy="nav-header-text"
                        >
                            <Icon
                                name={
                                    sideMode === 'on'
                                        ? 'ri-menu-unfold-line'
                                        : 'ri-menu-fold-line'
                                }
                                size="lg"
                                className={`${styles.Icon} ${
                                    sideMode === 'on' ? styles.Active : ''
                                } marianne`}
                            />
                            <Icon
                                name="ri-arrow-left-s-line"
                                iconPosition="right"
                                className={styles.Arrow}
                            >
                                <Text
                                    className={`${
                                        sideMode === 'on' ? 'hidden' : ''
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
                        className={`${styles.SideNavContent} ${sideMode ===
                            'off' && styles.Active}`}
                    >
                        {items.map(section => {
                            const { title, content, component } = section

                            if (component && content.length > 0) {
                                return (
                                    <SideMenuItem
                                        key={title}
                                        className={
                                            sideMode === 'on' ? 'hidden' : ''
                                        }
                                        title={title}
                                        expandedDefault
                                    >
                                        {content.map(subSection => {
                                            const {
                                                title: subSectionTitle,
                                            } = subSection

                                            return (
                                                <SideMenuLink
                                                    className={`${sideMode ===
                                                        'on' &&
                                                        'hidden'} marianne`}
                                                    onClick={e =>
                                                        goToSection(
                                                            e,
                                                            sectionUniqueId(
                                                                subSectionTitle
                                                            )
                                                        )
                                                    }
                                                    href="/"
                                                    key={subSectionTitle}
                                                >
                                                    {subSectionTitle}
                                                </SideMenuLink>
                                            )
                                        })}
                                    </SideMenuItem>
                                )
                            }

                            return (
                                <SideMenuLink
                                    className={
                                        sideMode === 'on' ? 'hidden' : ''
                                    }
                                    onClick={e =>
                                        goToSection(
                                            e,
                                            sectionUniqueId(
                                                title,
                                                content.length
                                            )
                                        )
                                    }
                                    href="/"
                                    key={`${title}-${content.length}`}
                                >
                                    {title}
                                </SideMenuLink>
                            )
                        })}
                    </ul>
                </div>
            </li>
        </SideMenu>
    )
}
