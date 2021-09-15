import { Breadcrumb, BreadcrumbItem, Container } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import NavLink from '../NavLink';

export default function DynamicBreadcrumb() {
    const router = useRouter();
    const pages = {
        '/structure/create': [{ label: 'Ajouter une structure' }],
        '/person/create': [{ label: 'Ajouter une personne' }],
        '/national': [{ label: 'France' }],
        '/national/list': [{ label: 'Listes qualifiées d\'établissements' }],
        '/national/list/university': [{
            label: 'Listes qualifiées d\'établissements',
            href: '/national/list/'
        }, { label: 'Les Universités' }],
    };

    if (!pages[router.asPath]) return null;

    return <Container>
        <Breadcrumb>
            <BreadcrumbItem
                asLink={<NavLink href="/">Accueil</NavLink>}>Accueil</BreadcrumbItem>
            {pages[router.asPath].map((elm, i) => {
                return <BreadcrumbItem
                    href={i === pages[router.asPath].length - 1 ? '' : elm.href}

                    key={elm.label}
                    data-cy={'current-page'}
                    asLink={elm.href ? <NavLink href={elm.href}>Accueil</NavLink>: null}>
                    {elm.label}
                </BreadcrumbItem>;
            })}
        </Breadcrumb>
    </Container>;
}
