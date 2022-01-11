import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getObjectType } from '../../../helpers/constants';
import grid from '../../../helpers/imports';

const CardLink = dynamic(() => import('../../../components/CardLink'));
const HeaderLayout = dynamic(() => import('../../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../../components/Layout'));

export default function SearchObject() {
    const { Col, Row, Container } = grid();

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
