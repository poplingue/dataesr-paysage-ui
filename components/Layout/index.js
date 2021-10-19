import {
    Col,
    Container,
    Header,
    HeaderBody,
    HeaderNav,
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
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import DynamicBreadcrumb from '../DynamicBreadcrumb';
import NavLink from '../NavLink';

// TODO add propTypes
export default function Layout({ children, mainTitle, pageTitle }) {
    const { pathname } = useRouter();
    const [waitWindow, setWaitWindow] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!waitWindow) {
            setWaitWindow(true);
        }
    }, [waitWindow]);

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
            {waitWindow && <><Header>
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
                    <NavItem title="Accueil" asLink={<NavLink href="/">Accueil</NavLink>}/>
                    <NavItem title="Je contribue">
                        <NavSubItem
                            current={pathname.startsWith('/create/structure')}
                            title="Ajouter une structure"
                            asLink={<NavLink href="/create/structure"/>}
                        />
                        <NavSubItem
                            current={pathname.startsWith('/create/person')}
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
                    <NavItem title="Ressources" asLink={<NavLink href="/resources"/>} />
                    <NavItem title="Aide" asLink={<NavLink href="/help"/>}/>
                </HeaderNav>
            </Header><SwitchTheme isOpen={isOpen} setIsOpen={setIsOpen}/></>}
            <DynamicBreadcrumb/>
            <Container>
                <Row>
                    <Col>
                        <h1 className="fs-32-40 marianne-bold">{pageTitle}</h1>
                        {children}
                    </Col>
                </Row>
            </Container>
            <Toaster/>
        </>
    );
}
