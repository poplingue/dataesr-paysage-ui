import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const CreatePerson = dynamic(() =>
    import('./../../../components/CreatePerson')
);
const CreateStructure = dynamic(() =>
    import('./../../../components/CreateStructure')
);

export default function Create({ data }) {
    const router = useRouter();
    const { object } = router.query;
    const components = {
        person: CreatePerson,
        structure: CreateStructure,
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
