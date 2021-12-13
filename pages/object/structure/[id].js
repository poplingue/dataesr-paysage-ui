import { useRouter } from 'next/router';

import FieldButton from '../../../components/FieldButton';
import HeaderLayout from '../../../components/HeaderLayout';
import Layout from '../../../components/Layout';
import SideNavigation from '../../../components/SideNavigation';
import Structure from '../../../components/Structure';
import ToolBox from '../../../components/ToolBox';
import { StructurePageSkeleton } from '../../../helpers/constants';

export default function Object() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Layout>
            <HeaderLayout
                pageTitle="Une Structure"
                highlight="Last update on Tuesday 5th of September 2020"
            />
            <SideNavigation items={StructurePageSkeleton}>
                <Structure id={id}>
                    <ToolBox>
                        <FieldButton title="Tools" />
                    </ToolBox>
                </Structure>
            </SideNavigation>
        </Layout>
    );
}
