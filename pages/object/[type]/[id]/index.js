import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getObjectType } from '../../../../helpers/constants';
import grid from '../../../../helpers/imports';

const Layout = dynamic(() => import('./../../../../components/Layout'));
const HeaderLayout = dynamic(() =>
    import('./../../../../components/HeaderLayout')
);

// TODO to remove??
export default function Object() {
    const { Col, Row, Container } = grid();

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
