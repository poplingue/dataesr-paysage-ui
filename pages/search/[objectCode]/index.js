import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getObjectTypeDetails } from '../../../config/utils';
import grid from '../../../helpers/imports';
import ObjectService from '../../../services/Object.service';

const CardLink = dynamic(() => import('../../../components/CardLink'));
const HeaderLayout = dynamic(() => import('../../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../../components/Layout'));

export default function SearchObject({ data }) {
    const { Col, Row, Container } = grid();

    const router = useRouter();
    const { objectCode } = router.query;

    return (
        <Layout>
            <HeaderLayout
                pageTitle={`Les objets « ${
                    getObjectTypeDetails(objectCode).title
                } »`}
            />
            <Container>
                <Row gutters>
                    {data.map((obj) => {
                        const name = getObjectTypeDetails(objectCode)
                            ? getObjectTypeDetails(objectCode).name
                            : objectCode;

                        return (
                            <Col n="3" key={obj.id}>
                                <CardLink
                                    link={`/object/${
                                        getObjectTypeDetails(objectCode).name
                                    }/${obj.id}`}
                                    supInfo={name}
                                    subInfo={obj.id}
                                    info={obj.id || ''}
                                />
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </Layout>
    );
}

export async function getServerSideProps({ query }) {
    const { data } = await ObjectService.getAll(query.objectCode);

    return { props: { data } };
}
