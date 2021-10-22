import { useRouter } from 'next/router';
import FieldButton from '../../../components/FieldButton';
import Layout from '../../../components/Layout';
import Person from '../../../components/Person';
import SideNavigation from '../../../components/SideNavigation';
import ToolBox from '../../../components/ToolBox';
import { PersonPageSkeleton } from '../../../helpers/constants';
import NoSSRWrapper from '../../../helpers/no-ssr-wrapper';

export default function Object() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Layout
            pageTitle="Une Personne"
            fluid
            highlight="Last update on Tuesday 5th of September 2020">
            <NoSSRWrapper>
                <SideNavigation items={PersonPageSkeleton}>
                    <Person id={id}/>
                </SideNavigation>
                <ToolBox>
                    <FieldButton title="Tools"/>
                </ToolBox>
            </NoSSRWrapper>
        </Layout>
    );
}
