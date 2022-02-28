import dynamic from 'next/dynamic';

import 'react-tabulator/css/tabulator_materialize.min.css';
import 'react-tabulator/css/semantic-ui/tabulator_semantic-ui.min.css';

import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect } from 'react';
import NavLink from '../../../../components/NavLink';
import { AppContext } from '../../../../context/GlobalState';
import { StructurePageSkeleton } from '../../../../helpers/constants';
import ObjectService from '../../../../services/Object.service';

const Structure = dynamic(() => import('../../../../components/Structure'));
const ToolBox = dynamic(() => import('../../../../components/ToolBox'));
const SideNavigation = dynamic(() =>
    import('../../../../components/SideNavigation')
);
const HeaderLayout = dynamic(() =>
    import('../../../../components/HeaderLayout')
);
const Layout = dynamic(() => import('../../../../components/Layout'));

const templateObj = {
    structure: {
        component: Structure,
        skeleton: StructurePageSkeleton,
    },
};

export default function PaysageObject({ data }) {
    const {
        query: { id, type },
    } = useRouter();

    const Component = templateObj[type].component;
    const initSkeleton = templateObj[type].skeleton;

    const {
        statePage: { accordionSkeleton: skeleton },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const updateSkeleton = useCallback(
        (payload) => {
            dispatch({
                type: 'UPDATE_ACCORDION_SKELETON',
                payload,
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
            updateSkeleton(initSkeleton);
        }
    }, [initSkeleton, skeleton, updateSkeleton]);

    return (
        <Layout>
            <HeaderLayout
                pageTitle={
                    !!Object.keys(data).length ? data.currentName.usualName : ''
                }
                status={data.status}
            />
            <SideNavigation items={skeleton} color="Yellow">
                <Component
                    id={id}
                    fame={data.fame}
                    name={
                        !!Object.keys(data).length
                            ? data.currentName.usualName
                            : ''
                    }
                    skeleton={skeleton}
                >
                    <ToolBox printer accordions initialSkeleton={initSkeleton}>
                        <NavLink href={`/update/structure/${id}`}>
                            modifier
                        </NavLink>
                    </ToolBox>
                </Component>
            </SideNavigation>
        </Layout>
    );
}

export async function getServerSideProps({ query }) {
    const data = (await ObjectService.getOne(query.type, query.id)) || {};

    return { props: { data } };
}
