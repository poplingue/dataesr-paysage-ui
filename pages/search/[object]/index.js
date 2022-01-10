import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { getObjectType } from '../../../helpers/constants';

const HeaderLayout = dynamic(() => import('../../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../../components/Layout'));
const NavLink = dynamic(() => import('../../../components/NavLink'));

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
