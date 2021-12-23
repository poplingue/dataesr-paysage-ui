import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../../context/GlobalState';

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

    const {
        stateForm: { updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const Component = object ? components[object] : null;

    useEffect(() => {
        const updateObjectId = Cookies.get('updateObjectId');

        if (updateObjectId && object) {
            dispatch({
                type: 'UPDATE_UPDATE_OBJECT_ID',
                payload: { updateObjectId },
            });
        }
    }, [dispatch, object]);

    return Component && <Component data={data} id={updateObjectId} />;
}

export async function getStaticProps() {
    // fetched on build
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
        paths: ['/update/person', '/update/structure'],
        fallback: true,
    };
}
