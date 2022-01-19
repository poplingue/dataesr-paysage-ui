import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/GlobalState';
import grid from '../helpers/imports';
import {
    activateAdviceMsg,
    connectedMsg,
    inactiveUserError,
    noTokensError,
} from '../helpers/internalMessages';
import accountService from '../services/Account.service';
import NotifService from '../services/Notif.service';

const Tile = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Tile)
);
const TileBody = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.TileBody)
);
const HeaderLayout = dynamic(() => import('../components/HeaderLayout'));
const Layout = dynamic(() => import('../components/Layout'));

function Home() {
    const { Col, Row, Container } = grid();
    const [hello, setHello] = useState(null);

    const router = useRouter();
    const tokens = Cookies.get('tokens');

    const {
        statePage: { user, userError, userConnected },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    useEffect(() => {
        const tokens = Cookies.get('tokens');

        if (tokens) {
            const objTokens = JSON.parse(tokens);

            accountService
                .me(objTokens)
                .then(({ data }) => {
                    if (data && !userConnected) {
                        dispatch({
                            type: 'UPDATE_USER',
                            payload: data,
                        });

                        dispatch({
                            type: 'UPDATE_USER_CONNECTION',
                            payload: true,
                        });

                        // TODO still usefull??
                        setHello(`Salut à toi ${user.username}`);
                    }
                })
                .catch((error) => {
                    // TODO refactio
                    if (
                        error === inactiveUserError ||
                        error === noTokensError
                    ) {
                        dispatch({
                            type: 'UPDATE_USER_ERROR',
                            payload: error,
                        });
                    }

                    return dispatch({
                        type: 'UPDATE_ERROR',
                        payload: error,
                    });
                });
        }
    }, [dispatch, user, userConnected]);

    useEffect(() => {
        if (!userError && userConnected) {
            NotifService.info(connectedMsg, 'valid');
        }
    }, [userConnected, userError]);

    useEffect(() => {
        if (userError === inactiveUserError && tokens) {
            router.push('/account/activate-account').then(() => {
                NotifService.info(activateAdviceMsg, 'neutral', 10000);
            });
        }
    }, [router, tokens, userConnected, userError]);

    return (
        <Layout>
            <HeaderLayout />
            <Container>
                <Row>
                    <Col spacing="mb-5w">
                        <h2>Recherchez</h2>
                    </Col>
                </Row>
                <Row>
                    <Col n="12" spacing="mb-3w">
                        <h2 data-cy="user">
                            {userConnected
                                ? `Salut à toi ${user.username || ''}`
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
        </Layout>
    );
}

export default Home;
