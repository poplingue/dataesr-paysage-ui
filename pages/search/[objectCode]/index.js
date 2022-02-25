import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getObjectType } from '../../../helpers/constants';
import grid from '../../../helpers/imports';
import ObjectService from '../../../services/Object.service';

const CardLink = dynamic(() => import('../../../components/CardLink'));
const HeaderLayout = dynamic(() => import('../../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../../components/Layout'));

export default function SearchObject({ data }) {
    const { Col, Row, Container } = grid();

    const router = useRouter();
    const { objectCode } = router.query;
    console.log('==== SearchObject ==== ', data);

    return (
        <Layout>
            <HeaderLayout pageTitle="Recherche" />
            <Container>
                <Row gutters>
                    {data.map((obj) => {
                        const name = getObjectType(objectCode)
                            ? getObjectType(objectCode).name
                            : objectCode;

                        return (
                            <Col n="3" key={obj.id}>
                                <CardLink
                                    link={`/object/${
                                        getObjectType(objectCode).name
                                    }/${obj.id}`}
                                    supInfo={name}
                                    subInfo={obj.id}
                                    info={obj.currentName.usualName}
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
    const { data } = await ObjectService.get(query.objectCode);

    return { props: { data } };
}
