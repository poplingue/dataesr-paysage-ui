import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getObjectType } from '../../../../helpers/constants';

const Col = dynamic(() => import('@dataesr/react-dsfr').then((mod) => mod.Col));
const Container = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Container)
);
const Row = dynamic(() => import('@dataesr/react-dsfr').then((mod) => mod.Row));

const Layout = dynamic(() => import('./../../../../components/Layout'));
const HeaderLayout = dynamic(() =>
    import('./../../../../components/HeaderLayout')
);

// TODO to remove??
export default function Object() {
    const router = useRouter();
    const { type, id } = router.query;
    const title = getObjectType(type) ? getObjectType(type).title : type;
    const name = getObjectType(type) ? getObjectType(type).name : type;

    return (
        <Layout>
            <HeaderLayout pageTitle={title} />
            <Container>
                <Row>
                    <Col n="12">Structure : {id}</Col>
                    <Col>Object Type : {name}</Col>
                </Row>
            </Container>
        </Layout>
    );
}
