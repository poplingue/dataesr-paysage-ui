import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import HomeSearch from '../../../components/HomeSearch';
import TileElement from '../../../components/TileElement';
import { getObjectTypeDetails } from '../../../config/utils';
import grid from '../../../helpers/imports';
import useCSSProperty from '../../../hooks/useCSSProperty';
import ObjectService from '../../../services/Object.service';

const CardLink = dynamic(() => import('../../../components/CardLink'));
const HeaderLayout = dynamic(() => import('../../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../../components/Layout'));

export default function SearchObject({ data }) {
    const { Col, Row, Container } = grid();

    const router = useRouter();
    const { objectCode } = router.query;
    const { style: color } = useCSSProperty(
        getObjectTypeDetails(objectCode).color
    );

    return (
        <Layout>
            <HeaderLayout
                pageTitle={`Les objets « ${
                    getObjectTypeDetails(objectCode).title
                } »`}
            />
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
                                    const name = getObjectTypeDetails(
                                        objectCode
                                    )
                                        ? getObjectTypeDetails(objectCode).name
                                        : objectCode;

                                    return (
                                        <Col n="3" key={obj.id}>
                                            <TileElement
                                                title={obj.id}
                                                body={name}
                                                href={`/object/${
                                                    getObjectTypeDetails(
                                                        objectCode
                                                    ).name
                                                }/${obj.id}`}
                                                color={color}
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
