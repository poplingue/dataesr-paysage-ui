import { Col, Container, Row } from '@dataesr/react-dsfr';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import FieldButton from '../../components/FieldButton';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
import NavLink from '../../components/NavLink';
import { AppContext } from '../../context/GlobalState';
import { lostPasswordMsg } from '../../helpers/internalMessages';
import authService from '../../services/Auth.service';

export default function Help() {
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
                    payload: { user: {} },
                });

                dispatch({
                    type: 'UPDATE_ERROR',
                    payload: { error: '' },
                });

                dispatch({
                    type: 'UPDATE_USER_CONNECTION',
                    payload: { userConnected: false },
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
