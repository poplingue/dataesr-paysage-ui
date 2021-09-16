import { Breadcrumb, BreadcrumbItem, Container } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import NavLink from '../NavLink';

export default function DynamicBreadcrumb() {
    const router = useRouter();
    const { category, id } = router.query;

    const pages = {
        '/create/structure': [{ label: 'Ajouter une structure' }],
        '/create/person': [{ label: 'Ajouter une personne' }],
        '/list': [{ label: 'Listes qualifiées' }],
        [`/list/${category}/${id}`]: [
            {
                label: 'Listes qualifiées',
                href: '/list/'
            },
            {
                label: `${category}`,
                href: `/list/${category}/`
            },
            {
                label: `${id}`
            }
        ],
        [`/list/${category}`]: [
            {
                label: 'Listes qualifiées',
                href: '/list'
            },
            {
                label: `${category}`
            }
        ],
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
                    asLink={elm.href ? <NavLink href={elm.href}>Accueil</NavLink> : null}>
                    {elm.label}
                </BreadcrumbItem>;
            })}
        </Breadcrumb>
    </Container>;
}
