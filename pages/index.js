import dynamic from 'next/dynamic';

import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import HomeSearch from '../components/HomeSearch';
import { AppContext } from '../context/GlobalState';
import { fetchHelper } from '../helpers/fetch';
import grid from '../helpers/imports';
import {
    activateAdviceMsg,
    connectedMsg,
    inactiveUserError,
} from '../helpers/internalMessages';
import NotifService from '../services/Notif.service';

const Tile = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Tile)
);
const TileBody = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.TileBody)
);
const HeaderLayout = dynamic(() => import('../components/HeaderLayout'));
const Layout = dynamic(() => import('../components/Layout'));

function Home({ tokens = {} }) {
    const { Col, Row, Container } = grid();

    const router = useRouter();

    const {
        statePage: { user, error },
    } = useContext(AppContext);

    useEffect(() => {
        if (!error && tokens) {
            NotifService.info(connectedMsg, 'valid');
        }
    }, [error, tokens]);

    useEffect(() => {
        if (error === inactiveUserError && tokens) {
            router.push('/account/activate-account').then(() => {
                NotifService.info(activateAdviceMsg, 'neutral', 10000);
            });
        }
    }, [router, tokens, error]);

    return (
        <Layout>
            <HeaderLayout />
            <Container fluid>
                <Row>
                    <Col spacing="mb-5w">
                        <HomeSearch />
                    </Col>
                </Row>
                <Row>
                    <Container>
                        <Row>
                            <Col n="12" spacing="mb-3w">
                                <h2 data-cy="user">
                                    {!!Object.keys(user).length
                                        ? `Salut à toi ${user.fullName || ''}`
                                        : 'Salut'}
                                </h2>
                            </Col>
                            <Col n="12">
                                <Row gutters>
                                    <Col n="4">
                                        <Tile horizontalMedium>
                                            <TileBody
                                                title="Temps passé sur le site"
                                                description="22h50"
                                            ></TileBody>
                                        </Tile>
                                    </Col>
                                    <Col n="4">
                                        <Tile horizontalMedium>
                                            <TileBody
                                                title="Nombre de modifications"
                                                description="328"
                                            ></TileBody>
                                        </Tile>
                                    </Col>
                                    <Col n="4">
                                        <Tile horizontalMedium>
                                            <TileBody
                                                title="Nombre d'objets ajoutés"
                                                description="12"
                                            ></TileBody>
                                        </Tile>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Container>
                </Row>
            </Container>
        </Layout>
    );
}

export async function getServerSideProps({ req }) {
    const tokens = fetchHelper.headerTokens(req);

    return { props: { tokens: tokens || '' } };
}

export default Home;
