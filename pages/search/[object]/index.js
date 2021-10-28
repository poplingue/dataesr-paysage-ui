import { Col, Container, Row, Tile, TileBody } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import HeaderLayout from '../../../components/HeaderLayout';
import Layout from '../../../components/Layout';
import NavLink from '../../../components/NavLink';
import { getObjectType } from '../../../helpers/constants';

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
                    <Col>
                        <Tile className="w-100" horizontal>
                            <TileBody
                                title={title}
                                linkHref={`/object/${name}/1`}
                                asLink={
                                    <NavLink href={`/object/${name}/1`}>
                                        {name}
                                    </NavLink>
                                }
                            >
                                <p>description</p>
                            </TileBody>
                        </Tile>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
