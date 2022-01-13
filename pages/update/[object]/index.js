import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../../context/GlobalState';

const UpdatePerson = dynamic(() => import('../../../components/UpdatePerson'));
const UpdateStructure = dynamic(() =>
    import('../../../components/UpdateStructure')
);

export default function UpdateObject({ data }) {
    const router = useRouter();
    const cookies = parseCookies();
    const { object } = router.query;
    const components = {
        person: UpdatePerson,
        structure: UpdateStructure,
    };

    const {
        stateForm: { updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const Component = object ? components[object] : null;

    useEffect(() => {
        const updateObjectId = cookies.updateObjectId;

        if (updateObjectId && object) {
            dispatch({
                type: 'UPDATE_UPDATE_OBJECT_ID',
                payload: { updateObjectId },
            });
        }
    }, [cookies.updateObjectId, dispatch, object]);

    return (
        Component && (
            <Component
                data={data}
                id={cookies.updateObjectId || updateObjectId}
            />
        )
    );
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
