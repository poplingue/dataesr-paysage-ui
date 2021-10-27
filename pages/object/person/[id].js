import { useRouter } from 'next/router';
import FieldButton from '../../../components/FieldButton';
import HeaderLayout from '../../../components/HeaderLayout';
import Layout from '../../../components/Layout';
import Person from '../../../components/Person';
import SideNavigation from '../../../components/SideNavigation';
import ToolBox from '../../../components/ToolBox';
import { PersonPageSkeleton } from '../../../helpers/constants';

export default function Object() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Layout>
            <HeaderLayout pageTitle="Une Personne"
                          highlight="Last update on Tuesday 5th of September 2020"/>
            <SideNavigation items={PersonPageSkeleton}>
                <Person id={id}>
                    <ToolBox>
                        <FieldButton title="Tools"/>
                    </ToolBox>
                </Person>
            </SideNavigation>
        </Layout>
    );
}
