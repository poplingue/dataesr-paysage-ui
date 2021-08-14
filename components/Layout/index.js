import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import {
    Header,
    HeaderBody,
    Logo,
    Service,
    Tool,
    Link as DSLink,
    ToolItemGroup,
    ToolItem,
    HeaderNav,
    NavItem,
    NavSubItem,
    SwitchTheme,
} from '@dataesr/react-dsfr';
import { AppContext } from '../../context/GlobalState';
import NavLink from '../NavLink';

export default function Layout({ children, mainTitle }) {
    // const theme = useTheme();
    const { state: { pathname } } = useContext(AppContext);
    const [path, setPath] = useState(() => pathname || '');
    const [h, setH] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!h) {
            setH(true);
        }
    }, [h]);
    //TODO manage error boundaries https://blog.openreplay.com/catching-errors-in-react-with-error-boundaries
    return (
        <>
            <Head>
                <title>{mainTitle || 'Paysage'}</title>
                <link rel="icon" href="/favicon/favicon.ico"/>
                <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet"/>
            </Head>
            {h && <><Header>
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
                <HeaderNav path={path}>
                    <NavItem title="Accueil" asLink={<NavLink href="/">Accueil</NavLink>}/>
                    <NavItem title="Je contribue">
                        <NavSubItem
                            current={path.startsWith('/structure/create')}
                            title="Ajouter une structure"
                            asLink={<NavLink href="/structure/create"/>}
                        />
                        <NavSubItem
                            current={path.startsWith('/structure/create')}
                            title="Ajouter une personne"
                            asLink={<NavLink href="/person/create"/>}
                        />
                        <NavSubItem title="Ressource #3" link="/path-to-resources-3"/>
                    </NavItem>
                    <NavItem title="Ressources">
                        <NavSubItem
                            link="https://scanr.enseignementsup-recherche.gouv.fr/"
                            title="ScanR"
                        />
                        <NavSubItem
                            link="https://curiexplore.enseignementsup-recherche.gouv.fr/"
                            title="CurieXplore"
                        />
                    </NavItem>
                    <NavItem title="Aide" link="/"/>
                </HeaderNav>
            </Header><SwitchTheme isOpen={isOpen} setIsOpen={setIsOpen}/></>}
            {children}
            <Toaster/>
        </>
    );
}
