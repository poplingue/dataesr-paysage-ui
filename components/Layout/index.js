import {
    Col,
    Container,
    Footer,
    FooterBody,
    FooterBodyItem,
    FooterBottom,
    FooterCopy,
    FooterLink,
    FooterTop,
    FooterTopCategory,
    Header,
    HeaderBody,
    HeaderNav,
    Link,
    Logo,
    NavItem,
    NavSubItem,
    Row,
    Service,
    SwitchTheme,
    Tool,
    ToolItem,
    ToolItemGroup,
} from '@dataesr/react-dsfr';

import Cookies from 'js-cookie';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { disconnectedMsg } from '../../helpers/internalMessages';
import NotifService from '../../services/Notif.service';
import { userService } from '../../services/User.service';
import NavLink from '../NavLink';

const { publicRuntimeConfig } = getConfig();

// TODO add propTypes
export default function Layout({ children, headTitle }) {
    const { pathname, asPath } = useRouter();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    //TODO manage error boundaries https://blog.openreplay.com/catching-errors-in-react-with-error-boundaries
    const {
        statePage: { userConnected },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const signOut = () => {
        userService.signOut().then(() => {
            NotifService.info(disconnectedMsg, 'valid');

            if (userConnected) {
                dispatch({
                    type: 'UPDATE_USER',
                    payload: { user: {} },
                });

                dispatch({
                    type: 'UPDATE_USER_CONNECTION',
                    payload: { userConnected: false },
                });

                dispatch({
                    type: 'UPDATE_ERROR',
                    payload: { error: '' },
                });

                Cookies.set('userConnected', false);
            }

            router.push('/account/sign-in');
        });
    };

    return (
        <>
            <Head>
                <title>{headTitle || 'Paysage'}</title>
                <link
                    rel="icon"
                    href={`${publicRuntimeConfig.basePath}/favicon/favicon.ico`}
                />
                <link
                    href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
                    rel="stylesheet"
                />
                <link
                    rel="preload"
                    href={`${publicRuntimeConfig.basePath}/fonts/Marianne-Regular.woff`}
                    as="font"
                    crossOrigin=""
                />
                <link
                    rel="preload"
                    href={`${publicRuntimeConfig.basePath}/fonts/Marianne-Regular.woff2`}
                    as="font"
                    crossOrigin=""
                />
                <link
                    rel="preload"
                    href={`${publicRuntimeConfig.basePath}/fonts/Marianne-Bold.woff`}
                    as="font"
                    crossOrigin=""
                />
                <link
                    rel="preload"
                    href={`${publicRuntimeConfig.basePath}/fonts/Marianne-Bold.woff2`}
                    as="font"
                    crossOrigin=""
                />
            </Head>
            <Header>
                <HeaderBody>
                    <Logo
                        splitCharacter={10}
                    >{`Ministère le l'enseignement supérieur et de la recherche`}</Logo>
                    <Service
                        title="Paysage"
                        description="Plateforme d'échanges et d'informations de la DGESIP et de la DGRI"
                    />
                    <Tool closeButtonLabel="fermer">
                        <ToolItemGroup>
                            {userConnected ? (
                                <ToolItem
                                    onClick={signOut}
                                    icon="ri-user-3-line"
                                    data-cy="sign-out"
                                >
                                    Se déconnecter
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
                                    Paramètres d’affichage
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
                    <NavItem
                        title="Je contribue"
                        current={asPath.startsWith('/create')}
                    >
                        <NavSubItem
                            current={
                                asPath.startsWith('/create') &&
                                !asPath.startsWith('/create/person')
                            }
                            title="Ajouter une structure"
                            asLink={<NavLink href="/create" />}
                        />
                        <NavSubItem
                            current={asPath.startsWith('/create/person')}
                            title="Ajouter une personne"
                            asLink={<NavLink href="/create/person" />}
                        />
                    </NavItem>
                    <NavItem title="Annuaire">
                        <NavSubItem
                            current={pathname.startsWith('/search/1')}
                            title="Rechercher une personne"
                            asLink={<NavLink href="/search" />}
                        />
                        <NavSubItem
                            title="Listes qualifiées"
                            asLink={<NavLink href="/list" />}
                        />
                    </NavItem>
                    <NavItem title="Répertoire">
                        <NavSubItem
                            current={pathname.startsWith('/search')}
                            title="Rechercher une structure"
                            asLink={<NavLink href="/search/0" />}
                        />
                        <NavSubItem
                            title="Listes qualifiées"
                            asLink={<NavLink href="/list" />}
                        />
                    </NavItem>
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
            <Container fluid spacing="mb-10w">
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
                <FooterBody description="Paysage : Plateforme d'échanges et d'informations de la DGESIP et de la DGRI">
                    <Logo>
                        Ministère de l‘enseignement supérieur de la rechercher
                        et de l‘innovation
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
                            Paramètres d’affichage
                        </span>
                    </FooterLink>
                    <FooterCopy href="/">
                        © République Française 2020
                    </FooterCopy>
                </FooterBottom>
            </Footer>
        </>
    );
}

Layout.defaultProps = {
    fluid: false,
    headTitle: '',
};
Layout.propTypes = {
    fluid: PropTypes.bool,
    headTitle: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
};
