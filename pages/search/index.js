import { Col, Container, Row, Tile, TileBody } from '@dataesr/react-dsfr';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
import NavLink from '../../components/NavLink';

export default function Search() {
    return (
        <Layout>
            <HeaderLayout pageTitle="Recherche" />
            <Container>
                <Row>
                    <Col>
                        <Tile className="w-100" horizontal>
                            <TileBody
                                title="Une Personne"
                                linkHref="/object/person/8"
                                asLink={
                                    <NavLink href="/object/person/8">
                                        Accueil
                                    </NavLink>
                                }
                            >
                                <p>Fonction</p>
                            </TileBody>
                        </Tile>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
