import { Col, Container, Icon, Row, Tile, TileBody } from '@dataesr/react-dsfr';
import getConfig from 'next/config';
import HeaderLayout from '../components/HeaderLayout';
import Layout from '../components/Layout';

export default function Home() {
    const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();

    // console.log(serverRuntimeConfig.secondSecret);
    // console.log(publicRuntimeConfig.user);

    return (
        <Layout>
            <HeaderLayout pageTitle="Bienvenue"/>
            <Container>
                <Row>
                    <h2>Recherchez</h2>
                </Row>
                <Row>
                    <Col n="12">
                        <Icon name="ri-user-3-line" size="xs">
                            <h1 className="fs-28-32 m-0">Salut Sam!</h1>
                        </Icon>
                    </Col>
                    <Col n="12">
                        <Row gutters>
                            <Col n="4">
                                <Tile horizontalMedium>
                                    <TileBody
                                        title="Temps passé sur le site"
                                        description="22h50"
                                    >
                                    </TileBody>
                                </Tile>
                            </Col>
                            <Col n="4">
                                <Tile horizontalMedium>
                                    <TileBody
                                        title="Nombre de modifications"
                                        description="328"
                                    >
                                    </TileBody>
                                </Tile>
                            </Col>
                            <Col n="4">
                                <Tile horizontalMedium>
                                    <TileBody
                                        title="Nombre d'objets ajoutés"
                                        description="12"
                                    >
                                    </TileBody>
                                </Tile>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
