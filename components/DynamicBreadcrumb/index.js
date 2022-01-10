import { Breadcrumb, BreadcrumbItem } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../../context/GlobalState';
import dsfrGrid from '../../helpers/imports';
import NavLink from '../NavLink';

export default function DynamicBreadcrumb() {
    const { Col, Row, Container } = dsfrGrid();

    const router = useRouter();
    const { category, id } = router.query;
    const {
        statePage: { hasBreadCrumbs },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const pages = useMemo(() => {
        return {
            '/update/structure': [{ label: 'Ajouter une structure' }],
            '/update/person': [{ label: 'Ajouter une personne' }],
            '/list': [{ label: 'Listes qualifiées' }],
            [`/list/${category}/${id}`]: [
                {
                    label: 'Listes qualifiées',
                    href: '/list/',
                },
                {
                    label: `${category}`,
                    href: `/list/${category}/`,
                },
                {
                    label: `${id}`,
                },
            ],
            [`/list/${category}`]: [
                {
                    label: 'Listes qualifiées',
                    href: '/list',
                },
                {
                    label: `${category}`,
                },
            ],
        };
    }, [category, id]);
    const active = !!pages[router.asPath];

    const breadCrumbsActive = useCallback(
        (display) => {
            dispatch({ type: 'UPDATE_HAS_BREADCRUMBS', payload: display });

            return null;
        },
        [dispatch]
    );

    useEffect(() => {
        if (hasBreadCrumbs !== active) {
            breadCrumbsActive(active);
        }
    }, [breadCrumbsActive, active, hasBreadCrumbs, pages, router.asPath]);

    return (
        hasBreadCrumbs &&
        active && (
            <Container>
                <Row>
                    <Col>
                        <Breadcrumb>
                            <BreadcrumbItem
                                asLink={<NavLink href="/">Accueil</NavLink>}
                            >
                                Accueil
                            </BreadcrumbItem>
                            {pages[router.asPath].map((elm, i) => {
                                return (
                                    <BreadcrumbItem
                                        href={
                                            i ===
                                            pages[router.asPath].length - 1
                                                ? ''
                                                : elm.href
                                        }
                                        key={elm.label}
                                        data-cy="current-page"
                                        asLink={
                                            elm.href ? (
                                                <NavLink href={elm.href}>
                                                    Accueil
                                                </NavLink>
                                            ) : null
                                        }
                                    >
                                        {elm.label}
                                    </BreadcrumbItem>
                                );
                            })}
                        </Breadcrumb>
                    </Col>
                </Row>
            </Container>
        )
    );
}
