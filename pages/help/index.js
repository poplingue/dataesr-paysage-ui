import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { setCookie } from 'nookies';
import { useContext } from 'react';
import LinkClick from '../../components/LinkClick';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { lostPasswordMsg } from '../../helpers/internalMessages';
import authService from '../../services/Auth.service';

const HeaderLayout = dynamic(() => import('./../../components/HeaderLayout'));
const Layout = dynamic(() => import('./../../components/Layout'));
const NavLink = dynamic(() => import('./../../components/NavLink'));
const FieldButton = dynamic(() => import('./../../components/FieldButton'));

export default function Help() {
    const { Col, Row, Container } = grid();

    const router = useRouter();
    const {
        statePage: { user, userConnected },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const lostPassword = (e) => {
        e.preventDefault();

        // TODO refacto
        if (userConnected) {
            authService.signOut().then(() => {
                dispatch({
                    type: 'UPDATE_USER',
                    payload: {},
                });

                dispatch({
                    type: 'UPDATE_ERROR',
                    payload: '',
                });

                dispatch({
                    type: 'UPDATE_USER_CONNECTION',
                    payload: false,
                });

                setCookie(null, 'userConnected', 'false', {
                    maxAge: 30 * 24 * 60 * 60,
                    path: '/',
                });

                router.push({
                    pathname: '/account/forgot-password',
                    query: { email: user.email },
                });
            });
        } else {
            router.push('/account/forgot-password');
        }
    };

    return (
        <Layout>
            <HeaderLayout pageTitle="Aide" />
            <Container>
                <Row gutters>
                    <Col n="12">
                        <NavLink
                            href={
                                userConnected
                                    ? '/account/activate-account'
                                    : '/account/sign-in'
                            }
                        >
                            Activer mon compte
                        </NavLink>
                    </Col>
                    <Col n="12">
                        <NavLink href="/account/reset-password">
                            {`Renouveler mon mot de passe avec le code d'activation reçu`}
                        </NavLink>
                    </Col>
                    <Col n="12">
                        <LinkClick
                            href="account/forgot-password"
                            onClick={(e) => lostPassword(e)}
                            text={lostPasswordMsg}
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
