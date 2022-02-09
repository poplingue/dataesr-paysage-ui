import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import LinkClick from '../../components/LinkClick';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { lostPasswordMsg } from '../../helpers/internalMessages';
import authService from '../../services/Auth.service';

const HeaderLayout = dynamic(() => import('./../../components/HeaderLayout'));
const Layout = dynamic(() => import('./../../components/Layout'));
const NavLink = dynamic(() => import('./../../components/NavLink'));

export default function Help() {
    const { Col, Row, Container } = grid();

    const router = useRouter();

    const {
        statePage: { user },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const lostPassword = (e) => {
        e.preventDefault();

        // TODO refacto
        if (user && user.username) {
            authService.signOut().then(() => {
                dispatch({
                    type: 'UPDATE_USER',
                    payload: {},
                });

                dispatch({
                    type: 'UPDATE_ERROR',
                    payload: '',
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
                                user && user.username
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
