import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import 'react-tabulator/css/tabulator_materialize.min.css';
import 'react-tabulator/css/semantic-ui/tabulator_semantic-ui.min.css';

import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../../../context/GlobalState';
import { StructurePageSkeleton } from '../../../../helpers/constants';

const Structure = dynamic(() => import('../../../../components/Structure'));
const ToolBox = dynamic(() => import('../../../../components/ToolBox'));
const SideNavigation = dynamic(() =>
    import('../../../../components/SideNavigation')
);
const HeaderLayout = dynamic(() =>
    import('../../../../components/HeaderLayout')
);
const Layout = dynamic(() => import('../../../../components/Layout'));

export default function Object(props) {
    const router = useRouter();
    const { id } = router.query;

    const {
        statePage: { accordionSkeleton: skeleton },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const updateSkeleton = useCallback(
        (payload) => {
            dispatch({
                type: 'UPDATE_ACCORDION_SKELETON',
                payload: { accordionSkeleton: payload },
            });
        },
        [dispatch]
    );

    useEffect(() => {
        return () => {
            updateSkeleton([]);
        };
    }, [updateSkeleton]);

    useEffect(() => {
        if (!skeleton.length) {
            updateSkeleton(StructurePageSkeleton);
        }
    }, [skeleton, updateSkeleton]);

    return (
        <Layout>
            <HeaderLayout pageTitle={props.name} status={props.status} />
            <SideNavigation items={skeleton} color="Yellow">
                <Structure
                    id={id}
                    fame={props.fame}
                    name={props.name}
                    skeleton={skeleton}
                >
                    <ToolBox
                        printer
                        accordions
                        initialSkeleton={StructurePageSkeleton}
                    />
                </Structure>
            </SideNavigation>
        </Layout>
    );
}

export async function getServerSideProps() {
    // fetch data Structure by id
    return {
        props: {
            id: 0,
            name: "IEA de Nantes Institut d'études avancées de Nantes ",
            fame: true,
            status: 'open',
        },
    };
}
