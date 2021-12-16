import { Col, Container, Icon, Row, Tile, TileBody } from '@dataesr/react-dsfr';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import HeaderLayout from '../components/HeaderLayout';
import Layout from '../components/Layout';
import { AppContext } from '../context/GlobalState';
import {
    activateAdviceMsg,
    connectedMsg,
    inactiveUserError,
} from '../helpers/internalMessages';
import NotifService from '../services/Notif.service';

function Home() {
    const router = useRouter();
    const tokens = Cookies.get('tokens');

    const {
        statePage: { user, error, userConnected },
    } = useContext(AppContext);

    useEffect(() => {
        if (!error && userConnected) {
            NotifService.info(connectedMsg, 'valid');
        }
    }, [error, userConnected]);

    useEffect(() => {
        if (error && error === inactiveUserError && tokens) {
            router.push('/account/activate-account').then(() => {
                NotifService.info(activateAdviceMsg, 'neutral', 10000);
            });
        }
    }, [router, tokens, error, userConnected]);

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
                        <Icon name="ri-user-3-line" size="xs" data-cy="user">
                            <h1 className="fs-28-32 m-0">
                                {userConnected
                                    ? `Salut à toi ${user.username || ''}`
                                    : 'Salut'}
                            </h1>
                        </Icon>
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
