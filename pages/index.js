import { Col, Container, Icon, Row, Tile, TileBody } from '@dataesr/react-dsfr';
import cookie from 'cookie';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import HeaderLayout from '../components/HeaderLayout';
import Layout from '../components/Layout';
import { fetchHelper } from '../helpers/fetch';
import NotifService from '../services/Notif.service';

function Home({ user, tokens }) {
    const router = useRouter();
    useEffect(() => {
        if (
            user.error &&
            user.error === 'Utilisateur inactif' &&
            !!Object.keys(tokens).length
        ) {
            router.push('/user/signin').then(() => {
                NotifService.info(
                    'Connectez vous pour activer votre compte',
                    'error'
                );
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Layout>
            <HeaderLayout
                pageTitle={
                    Object.keys(user).length
                        ? `Bienvenue à vous ${user.firstName} ${user.lastName}`
                        : 'Bienvenue'
                }
            />
            <Container>
                <Row>
                    <Col spacing="mb-5w">
                        <h2>Recherchez</h2>
                    </Col>
                </Row>
                <Row>
                    <Col n="12" spacing="mb-3w">
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

export async function getServerSideProps({ req }) {
    const cookies = cookie.parse(req.headers.cookie ? req.headers.cookie : '');
    let user = {};
    let tokens = {};

    if (cookies.tokens) {
        tokens = JSON.parse(cookies.tokens);
        const request = await fetch(
            'https://api.paysage.staging.dataesr.ovh/me',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...fetchHelper.authHeader(tokens),
                },
            }
        );
        const response = await request.text();
        user = JSON.parse(response);
    }

    return { props: { user, tokens } };
}

export default Home;
