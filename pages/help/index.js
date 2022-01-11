import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext } from 'react';
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

    const lostPassword = () => {
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

                Cookies.set('userConnected', false);

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
                        <FieldButton
                            onClick={lostPassword}
                            title={lostPasswordMsg}
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
