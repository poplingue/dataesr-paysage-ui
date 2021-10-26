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
    Highlight,
    Link,
    Logo,
    NavItem,
    NavSubItem,
    Row,
    Service,
    Title,
    Tool,
    ToolItem,
    ToolItemGroup,
} from '@dataesr/react-dsfr';

import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import DynamicBreadcrumb from '../DynamicBreadcrumb';
import NavLink from '../NavLink';


// TODO add propTypes
export default function Layout({ children, mainTitle, pageTitle, highlight, fluid }) {
    const { pathname, asPath } = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    //TODO manage error boundaries https://blog.openreplay.com/catching-errors-in-react-with-error-boundaries

    return (
        <>
            <Head>
                <title>{mainTitle || 'Paysage'}</title>
                <link rel="icon" href="/favicon/favicon.ico"/>
                <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet"/>
                <link
                    rel="preload"
                    href="/fonts/Marianne-Regular.woff"
                    as="font"
                    crossOrigin=""
                />
                <link
                    rel="preload"
                    href="/fonts/Marianne-Regular.woff2"
                    as="font"
                    crossOrigin=""
                />
                <link
                    rel="preload"
                    href="/fonts/Marianne-Bold.woff"
                    as="font"
                    crossOrigin=""
                />
                <link
                    rel="preload"
                    href="/fonts/Marianne-Bold.woff2"
                    as="font"
                    crossOrigin=""
                />
            </Head>
            <Header>
                <HeaderBody>
                    <Logo splitCharacter={10}>{`Ministère le l'enseignement supérieur et de la recherche`}</Logo>
                    <Service
                        title="Paysage"
                        description="Plateforme d'échanges et d'informations de la DGESIP et de la DGRI"
                    />
                    <Tool
                        closeButtonLabel="fermer"
                    >
                        <ToolItemGroup>
                            <ToolItem icon="ri-user-3-line" link="/path">Mon profil</ToolItem>
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
                    <NavItem title="Accueil" asLink={<NavLink href="/">Accueil</NavLink>} current={pathname === '/'}/>
                    <NavItem title="Je contribue" current={asPath.startsWith('/create')}>
                        <NavSubItem
                            current={asPath.startsWith('/create') && !asPath.startsWith('/create/person')}
                            title="Ajouter une structure"
                            asLink={<NavLink href="/create"/>}
                        />
                        <NavSubItem
                            current={asPath.startsWith('/create/person')}
                            title="Ajouter une personne"
                            asLink={<NavLink href="/create/person"/>}
                        />
                    </NavItem>
                    <NavItem title="Annuaire">
                        <NavSubItem
                            current={pathname.startsWith('/search')}
                            title="Rechercher une personne"
                            asLink={<NavLink href="/search"/>}
                        />
                        <NavSubItem
                            title="Listes qualifiées"
                            asLink={<NavLink href="/list"/>}
                        />
                    </NavItem>
                    <NavItem title="Répertoire">
                        <NavSubItem
                            current={pathname.startsWith('/search')}
                            title="Rechercher une structure"
                            asLink={<NavLink href="/search"/>}
                        />
                        <NavSubItem
                            title="Listes qualifiées"
                            asLink={<NavLink href="/list"/>}
                        />
                    </NavItem>
                    <NavItem title="Ressources" asLink={<NavLink href="/resources"/>}
                             current={pathname.startsWith('/resources')}/>
                    <NavItem title="Aide" asLink={<NavLink href="/help"/>} current={pathname.startsWith('/help')}/>
                </HeaderNav>
            </Header>
            {/*<SwitchTheme isOpen={isOpen} setIsOpen={setIsOpen}/>*/}
            <DynamicBreadcrumb/>
            <Container fluid={fluid} className='mb-60'>
                <section className="pt-24">
                    <Row>
                        <Col className="p-relative">
                            {pageTitle && <Container fluid className="psg-content-wrapper">
                                <Row>
                                    <Col className="psg-header-page mb-60">
                                        {highlight && <Highlight size="sm" className="mb-20">{highlight}</Highlight>}
                                        <Title as="h2" look="h3">{pageTitle}</Title>
                                    </Col>
                                </Row>
                            </Container>}
                            {children}
                        </Col>
                    </Row>
                </section>
            </Container>
            <Toaster/>
            <Footer>
                <FooterTop>
                    <FooterTopCategory title="Liens utiles">
                        <FooterLink asLink={<NavLink href="/help"/>}>Aide</FooterLink>
                        <FooterLink asLink={<NavLink href="/"/>}>Nous contacter</FooterLink>
                    </FooterTopCategory>
                </FooterTop>
                <FooterBody
                    description="Paysage : Plateforme d'échanges et d'informations de la DGESIP et de la DGRI"
                >
                    <Logo>Ministère de l‘enseignement supérieur de la rechercher et de l‘innovation</Logo>
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
                        <Link href="https://data.gouv.fr">
                            data.gouv.fr
                        </Link>
                    </FooterBodyItem>
                </FooterBody>
                <FooterBottom>
                    <FooterLink href="https://www.enseignementsup-recherche.gouv.fr/">enseignementsup-recherche.gouv.fr</FooterLink>
                    <FooterLink onClick={() => setIsOpen(true)}>
            <span
                className="fr-fi-theme-fill fr-link--icon-left"
                aria-controls="fr-theme-modal"
                data-fr-opened={isOpen}
            >
              Paramètres d’affichage
            </span>
                    </FooterLink>
                    <FooterCopy href="/">© République Française 2020</FooterCopy>
                </FooterBottom>
            </Footer>
        </>
    );
}

Layout.defaultProps = {
    fluid: false,
    highlight: '',
    pageTitle: '',
};
Layout.propTypes = {
    fluid: PropTypes.bool,
    highlight: PropTypes.string,
    pageTitle: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
};
