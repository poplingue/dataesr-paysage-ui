import dynamic from 'next/dynamic';
import CardLink from '../../components/CardLink';

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
                        <CardLink
                            link={`/object/person/8`}
                            info="Une personne"
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
