import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AppContext } from '../../../context/GlobalState';
import { goToSection, matchRegex } from '../../../helpers/utils';

const ContribOfficialDocument = dynamic(() =>
    import('../../../components/ContribOfficialDocument')
);
const ContribPerson = dynamic(() =>
    import('../../../components/ContribPerson')
);
const ContribCategory = dynamic(() =>
    import('../../../components/ContribCategory')
);
const ContribStructure = dynamic(() =>
    import('../../../components/ContribStructure')
);
const ContribPrice = dynamic(() => import('../../../components/ContribPrice'));
const ContribTerm = dynamic(() => import('../../../components/ContribTerm'));
const ContribDocument = dynamic(() =>
    import('../../../components/ContribDocument')
);
const ContribLegalCategory = dynamic(() =>
    import('../../../components/ContribLegalCategory')
);

export default function ContribObject({ data }) {
    const router = useRouter();

    const hashResourceId = matchRegex(/(?<=#)[\s\S]*/, router.asPath);
    const { object } = router.query;
    const components = {
        person: ContribPerson,
        price: ContribPrice,
        structure: ContribStructure,
        category: ContribCategory,
        officialDocument: ContribOfficialDocument,
        term: ContribTerm,
        document: ContribDocument,
        legalCategory: ContribLegalCategory,
    };

    const {
        stateForm: { updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const Component = object ? components[object] : null;

    useEffect(() => {
        // TODO better than setTimeout
        setTimeout(() => {
            if (hashResourceId) {
                goToSection(hashResourceId, 'id');
            }
        }, 800);
    }, [hashResourceId]);

    useEffect(() => {
        const updateObjectId = Cookies.get('updateObjectId');

        if (updateObjectId && object) {
            dispatch({
                type: 'UPDATE_UPDATE_OBJECT_ID',
                payload: { updateObjectId },
            });
        }
    }, [dispatch, object]);

    return (
        Component && (
            <Component
                data={data}
                id={Cookies.get('updateObjectId') || updateObjectId}
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
        paths: [
            '/contrib/person',
            '/contrib/structure',
            '/contrib/category',
            '/contrib/officialDocument',
            '/contrib/legalCategory',
            '/contrib/price',
            '/contrib/term',
            '/contrib/document',
        ],
        fallback: true,
    };
}
