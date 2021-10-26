import { Col, Container, Row, Tile, TileBody } from '@dataesr/react-dsfr';
import Layout from '../../components/Layout';
import NavLink from '../../components/NavLink';

export default function Search() {
    return (
        <Layout pageTitle="Recherche">
            <Container fluid>
                <Row>
                    <Col>
                        <p>Recherche...</p>
                    </Col>
                    <Col>
                        <Tile className="w-100" horizontal>
                            <TileBody
                                title="Person A"
                                linkHref="/object/person/8"
                                asLink={
                                    <NavLink href="/object/person/8">
                                        Accueil
                                    </NavLink>
                                }
                            >
                                <p>Person A</p>
                            </TileBody>
                        </Tile>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
