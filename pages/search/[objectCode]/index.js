import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { getObjectTypeDetails } from '../../../config/utils';
import grid from '../../../helpers/imports';
import useCSSProperty from '../../../hooks/useCSSProperty';
import ObjectService from '../../../services/Object.service';

const HomeSearch = dynamic(() => import('../../../components/HomeSearch'));
const TileElement = dynamic(() => import('../../../components/TileElement'));
const HeaderLayout = dynamic(() => import('../../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../../components/Layout'));

export default function SearchObject({ data }) {
    const { Col, Row, Container } = grid();

    const router = useRouter();
    const { objectCode } = router.query;
    const { color, name, title } = getObjectTypeDetails(objectCode);
    const { style: objectColor } = useCSSProperty(color);

    return (
        <Layout>
            <HeaderLayout pageTitle={`Les objets « ${title} »`} />
            <Container fluid>
                <Row>
                    <Col spacing="mb-5w">
                        <HomeSearch switchPage defaultType={objectCode} />
                    </Col>
                </Row>
                <Row gutters>
                    <Col>
                        <Container>
                            <Row gutters>
                                {data.map((obj) => {
                                    const { id } = obj;

                                    return (
                                        <Col n="3" key={id}>
                                            <TileElement
                                                title={id}
                                                body={name || objectCode}
                                                href={`/object/${name}/${id}`}
                                                color={objectColor}
                                                icon="ri-arrow-right-line"
                                            />
                                        </Col>
                                    );
                                })}
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

export async function getServerSideProps({ query }) {
    const { data } = await ObjectService.getAll(query.objectCode);

    return { props: { data } };
}
