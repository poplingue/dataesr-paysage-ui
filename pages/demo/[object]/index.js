import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const UpdatePerson = dynamic(() => import('../../../components/UpdatePerson'));
const UpdateStructure = dynamic(() =>
    import('../../../components/UpdateStructure')
);

export default function Create({ data }) {
    const router = useRouter();
    const { object } = router.query;
    const components = {
        person: UpdatePerson,
        structure: UpdateStructure,
    };
    const Component = object ? components[object] : null;

    return Component && <Component data={data} />;
}

export async function getStaticProps() {
    const res = await fetch(
        `https://geo.api.gouv.fr/departements?fields=nom,code,codeRegion`
    );
    const data = await res.json();

    if (!data) {
        return { notFound: true };
    }

    return { props: { data } };
}

export async function getStaticPaths() {
    return {
        paths: ['/demo/person', '/demo/structure'],
        fallback: true,
    };
}
