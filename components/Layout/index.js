import {
    FooterBodyItem,
    FooterCopy,
    FooterLink,
    Header,
    HeaderBody,
    HeaderNav,
    Logo,
    NavItem,
    NavSubItem,
    Service,
    Tool,
    ToolItem,
    ToolItemGroup,
} from '@dataesr/react-dsfr';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import {
    inactiveUserError,
    notConnectedMsg,
} from '../../helpers/internalMessages';
import NoSsrWrapper from '../../helpers/no-ssr-wrapper';
import useViewport from '../../hooks/useViewport';
import accountService from '../../services/Account.service';
import authService from '../../services/Auth.service';
import NotifService from '../../services/Notif.service';
import ModalDetail from '../ModalDetail';

const NavLink = dynamic(() => import('./../NavLink'));

const Link = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Link)
);
const SwitchTheme = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.SwitchTheme)
);
const FooterTop = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.FooterTop)
);
const FooterTopCategory = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.FooterTopCategory)
);
const Footer = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Footer)
);
const FooterBody = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.FooterBody)
);
const FooterBottom = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.FooterBottom)
);

function Layout({ children, headTitle }) {
    const { pathname, asPath } = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { mobile } = useViewport();
    //TODO manage error boundaries https://blog.openreplay.com/catching-errors-in-react-with-error-boundaries

    const {
        statePage: { error, user },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const router = useRouter();
    const noUser = !Object.keys(user).length;

    useEffect(() => {
        if (noUser) {
            accountService
                .me()
                .then((response) => {
                    if (response) {
                        dispatch({
                            type: 'UPDATE_USER',
                            payload: response,
                        });

                        dispatch({
                            type: 'UPDATE_ERROR',
                            payload: '',
                        });
                    }
                })
                .catch((error) => {
                    dispatch({
                        type: 'UPDATE_ERROR',
                        payload: error,
                    });
                });
        }
    }, [dispatch, noUser, router, user]);

    const signOut = () => {
        authService
            .signOut()
            .then(() => {
                dispatch({
                    type: 'UPDATE_USER',
                    payload: {},
                });

                dispatch({
                    type: 'UPDATE_ERROR',
                    payload: '',
                });

                router.push('/account/sign-in').then(() => {
                    NotifService.info(notConnectedMsg, 'valid');
                });
            })
            .catch(() => {
                router.push('/');
            });
    };

    const { Col, Row, Container } = grid();

    return (
        <>
            <Head>
                <title>{headTitle || 'Paysage'}</title>
                <link rel="icon" href="/favicon/favicon.ico" />
                <link
                    rel="preload"
                    href="/fonts/Marianne-Regular.woff"
                    as="font"
                    onLoad="this.onload=null;this.rel='font'"
                />
                <noscript>
                    <link rel="font" href="/fonts/Marianne-Regular.woff" />
                </noscript>
                <link
                    rel="preload"
                    href="/fonts/Marianne-Regular.woff2"
                    as="font"
                    onLoad="this.onload=null;this.rel='font'"
                />
                <noscript>
                    <link rel="font" href="/fonts/Marianne-Regular.woff2" />
                </noscript>
                <link
                    rel="preload"
                    href="/fonts/Marianne-Bold.woff"
                    as="font"
                    onLoad="this.onload=null;this.rel='font'"
                />
                <noscript>
                    <link rel="font" href="/fonts/Marianne-Bold.woff" />
                </noscript>
                <link
                    rel="preload"
                    href="/fonts/Marianne-Bold.woff2"
                    as="font"
                    onLoad="this.onload=null;this.rel='font'"
                />
                <noscript>
                    <link rel="font" href="/fonts/Marianne-Bold.woff2" />
                </noscript>
            </Head>
            <Header>
                <HeaderBody>
                    <Logo
                        splitCharacter={10}
                    >{`Minist??re le l'enseignement sup??rieur et de la recherche`}</Logo>
                    <Service
                        title="Paysage"
                        description="Plateforme d'??changes et d'informations de la DGESIP et de la DGRI"
                    />
                    <Tool closeButtonLabel="fermer">
                        <ToolItemGroup>
                            {!noUser || error === inactiveUserError ? (
                                <ToolItem
                                    onClick={signOut}
                                    icon="ri-user-3-line"
                                    data-cy="sign-out"
                                >
                                    Se d??connecter
                                </ToolItem>
                            ) : (
                                <ToolItem
                                    icon="ri-user-3-line"
                                    asLink={<NavLink href="/account/sign-in" />}
                                >
                                    Se connecter
                                </ToolItem>
                            )}
                            <ToolItem onClick={() => setIsOpen(true)}>
                                <span
                                    className="fr-fi-theme-fill fr-link--icon-left"
                                    aria-controls="fr-theme-modal"
                                    data-fr-opened={isOpen}
                                >
                                    Param??tres d???affichage
                                </span>
                            </ToolItem>
                        </ToolItemGroup>
                    </Tool>
                </HeaderBody>
                <HeaderNav path={pathname}>
                    <NavItem
                        title="Accueil"
                        asLink={<NavLink href="/">Accueil</NavLink>}
                        current={pathname === '/'}
                    />
                    {!noUser && (
                        <>
                            <NavItem
                                title="Je contribue"
                                current={asPath.startsWith('/contrib')}
                            >
                                <NavSubItem
                                    current={
                                        pathname.startsWith('/contrib') &&
                                        !pathname.endsWith('/import')
                                    }
                                    title="Ajouter un nouvel objet"
                                    asLink={<NavLink href="/contrib" />}
                                />
                                <NavSubItem
                                    current={pathname.endsWith('/import')}
                                    title="Ajouter en masse"
                                    asLink={
                                        <NavLink href="/contrib/structure/import" />
                                    }
                                />
                            </NavItem>
                            <NavItem title="Annuaire">
                                <NavSubItem
                                    current={pathname.startsWith('/search/1')}
                                    title="Rechercher une personne"
                                    asLink={<NavLink href="/search/1" />}
                                />
                                <NavSubItem
                                    title="Listes qualifi??es"
                                    asLink={<NavLink href="/list" />}
                                />
                            </NavItem>
                            <NavItem title="R??pertoire">
                                <NavSubItem
                                    current={pathname.startsWith('/search')}
                                    title="Rechercher une structure"
                                    asLink={<NavLink href="/search/0" />}
                                />
                                <NavSubItem
                                    title="Listes qualifi??es"
                                    asLink={<NavLink href="/list" />}
                                />
                            </NavItem>
                        </>
                    )}
                    <NavItem
                        title="Ressources"
                        asLink={<NavLink href="/resources" />}
                        current={pathname.startsWith('/resources')}
                    />
                    <NavItem
                        title="Aide"
                        asLink={<NavLink href="/help" />}
                        current={pathname.startsWith('/help')}
                    />
                </HeaderNav>
            </Header>
            <SwitchTheme isOpen={isOpen} setIsOpen={setIsOpen} />
            <Container fluid={!mobile} spacing="mb-10w">
                <Row>
                    <Col>{children}</Col>
                </Row>
            </Container>
            <Footer>
                <FooterTop>
                    <FooterTopCategory title="Liens utiles">
                        <FooterLink asLink={<NavLink href="/help" />}>
                            Aide
                        </FooterLink>
                        <FooterLink asLink={<NavLink href="/" />}>
                            Nous contacter
                        </FooterLink>
                    </FooterTopCategory>
                </FooterTop>
                <FooterBody description="Paysage : Plateforme d'??changes et d'informations de la DGESIP et de la DGRI">
                    <Logo>
                        Minist??re de l???enseignement sup??rieur de la rechercher
                        et de l???innovation
                    </Logo>
                    <FooterBodyItem>
                        <Link href="https://legifrance.gouv.fr">
                            legifrance.gouv.fr
                        </Link>
                    </FooterBodyItem>
                    <FooterBodyItem>
                        <Link href="https://gouvernement.fr">
                            gouvernement.fr
                        </Link>
                    </FooterBodyItem>
                    <FooterBodyItem>
                        <Link href="https://service-public.fr">
                            service-public.fr
                        </Link>
                    </FooterBodyItem>
                    <FooterBodyItem>
                        <Link href="https://data.gouv.fr">data.gouv.fr</Link>
                    </FooterBodyItem>
                </FooterBody>
                <FooterBottom>
                    <FooterLink href="https://www.enseignementsup-recherche.gouv.fr/">
                        enseignementsup-recherche.gouv.fr
                    </FooterLink>
                    <FooterLink onClick={() => setIsOpen(true)}>
                        <span
                            className="fr-fi-theme-fill fr-link--icon-left"
                            aria-controls="fr-theme-modal"
                            data-fr-opened={isOpen}
                        >
                            Param??tres d???affichage
                        </span>
                    </FooterLink>
                    <FooterCopy href="/">
                        ?? R??publique Fran??aise 2020
                    </FooterCopy>
                </FooterBottom>
            </Footer>
            <NoSsrWrapper>
                <ModalDetail />
            </NoSsrWrapper>
        </>
    );
}

Layout.defaultProps = {
    headTitle: '',
};
Layout.propTypes = {
    headTitle: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
};

export default Layout;
