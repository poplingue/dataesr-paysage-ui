import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import CardLink from '../../../components/CardLink';
import { getObjectType } from '../../../helpers/constants';

const HeaderLayout = dynamic(() => import('../../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../../components/Layout'));

const Col = dynamic(() => import('@dataesr/react-dsfr').then((mod) => mod.Col));
const Container = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Container)
);
const Row = dynamic(() => import('@dataesr/react-dsfr').then((mod) => mod.Row));

export default function SearchObject() {
    const router = useRouter();
    const { object } = router.query;
    const title = getObjectType(object) ? getObjectType(object).title : object;
    const name = getObjectType(object) ? getObjectType(object).name : object;

    return (
        <Layout>
            <HeaderLayout pageTitle="Recherche" />
            <Container>
                <Row>
                    <Col n="3">
                        <CardLink
                            link={`/object/${name}/1`}
                            supInfo={name}
                            subInfo="description"
                            info={title}
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
