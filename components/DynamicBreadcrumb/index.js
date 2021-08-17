import { Breadcrumb, BreadcrumbItem, Container } from '@dataesr/react-dsfr';
import NavLink from '../NavLink';
import { useRouter } from 'next/router';

export default function DynamicBreadcrumb() {
    const router = useRouter();
    const obj = {
        '/structure/create': ['Ajouter une structure'],
        '/person/create': ['Ajouter une personne']
    };
    if (!obj[router.asPath]) return null;
    return <Container>
        <Breadcrumb>
            <BreadcrumbItem href="/" asLink={<NavLink href="/">Accueil</NavLink>}>Accueil</BreadcrumbItem>
            {obj[router.asPath].map((elm, i) => {
                return <BreadcrumbItem key={elm} data-cy='current-page'>
                    {elm}
                </BreadcrumbItem>;
            })}
        </Breadcrumb>
    </Container>;
}
