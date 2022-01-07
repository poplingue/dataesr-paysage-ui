import { useRouter } from 'next/router';

import 'react-tabulator/css/tabulator_materialize.min.css';
import 'react-tabulator/css/semantic-ui/tabulator_semantic-ui.min.css';

import { useContext, useEffect } from 'react';
import HeaderLayout from '../../../../components/HeaderLayout';
import Layout from '../../../../components/Layout';
import SideNavigation from '../../../../components/SideNavigation';
import Structure from '../../../../components/Structure';
import ToolBox from '../../../../components/ToolBox';
import { AppContext } from '../../../../context/GlobalState';
import { StructurePageSkeleton } from '../../../../helpers/constants';

export default function Object(props) {
    const router = useRouter();
    const { id } = router.query;

    const {
        statePage: { accordionSkeleton: skeleton },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    // TODO refacto - make a hook?
    useEffect(() => {
        return () => {
            console.log('==== CLEAN accordionSkeleton==== ');
            dispatch({
                type: 'UPDATE_ACCORDION_SKELETON',
                payload: {
                    accordionSkeleton: [],
                },
            });
        };
    }, [dispatch]);

    useEffect(() => {
        if (!skeleton.length) {
            dispatch({
                type: 'UPDATE_ACCORDION_SKELETON',
                payload: {
                    accordionSkeleton: StructurePageSkeleton,
                },
            });
        }
    }, [dispatch, skeleton]);

    return (
        <Layout>
            <HeaderLayout pageTitle="Une Structure" />
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
