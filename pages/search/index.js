import dynamic from 'next/dynamic';

const Col = dynamic(() => import('@dataesr/react-dsfr').then((mod) => mod.Col));
const Container = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Container)
);
const Row = dynamic(() => import('@dataesr/react-dsfr').then((mod) => mod.Row));
const Tile = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Tile)
);
const TileBody = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.TileBody)
);

const HeaderLayout = dynamic(() => import('../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../components/Layout'));
const NavLink = dynamic(() => import('../../components/NavLink'));

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
