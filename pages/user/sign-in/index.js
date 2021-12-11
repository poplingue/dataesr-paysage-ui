import { Col, Container, Row } from '@dataesr/react-dsfr';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import * as Yup from 'yup';
import AuthForm from '../../../components/AuthForm';
import HeaderLayout from '../../../components/HeaderLayout';
import Layout from '../../../components/Layout';
import NavLink from '../../../components/NavLink';
import { AppContext } from '../../../context/GlobalState';
import {
    connectedMsg,
    emailErrorMsg,
    emailMandatoryMsg,
    emailPattern,
    emailPatternHint,
    lostPasswordMsg,
    passwordMandatoryMsg,
} from '../../../helpers/internalMessages';
import NotifService from '../../../services/Notif.service';
import { userService } from '../../../services/User.service';

const formSchema = [
    {
        name: 'account',
        type: 'email',
        label: 'Email',
        required: true,
    },
    {
        label: 'Mot de passe',
        name: 'password',
        type: 'password',
        required: true,
    },
];

function SignIn() {
    const router = useRouter();
    const cookieInfo = Cookies.get('user-info');
    const { dispatchPage: dispatch } = useContext(AppContext);

    useEffect(() => {
        if (cookieInfo) {
            NotifService.info(cookieInfo, 'neutral');
            Cookies.remove('user-info');
        }
    }, [cookieInfo]);

    const validationSchema = Yup.object().shape({
        account: Yup.string()
            .required(`${emailMandatoryMsg}`)
            .email(`${emailErrorMsg}`),
        password: Yup.string()
            .required(`${passwordMandatoryMsg}`)
            .matches(`${emailPattern}`, `${emailPatternHint}`),
    });

    const onSubmit = (formData) => {
        userService
            .signIn(formData)
            .then(() => {
                dispatch({
                    type: 'UPDATE_USER_CONNECTION',
                    payload: { userConnected: true },
                });

                router.push('/').then(() => {
                    NotifService.info(connectedMsg, 'valid');
                    // TODO really needed? to reload ?
                    router.reload();
                });
            })
            .catch((err) => {
                console.error('==== userService.signIn ==== ', err);
                NotifService.info(err, 'error');
            });
    };

    return (
        <Layout headTitle="Paysage - Se connecter">
            <HeaderLayout pageTitle="Se connecter" />
            <Container>
                <Row gutters>
                    <Col n="12 md-6">
                        <AuthForm
                            schema={formSchema}
                            onSubmit={onSubmit}
                            validationSchema={validationSchema}
                        />
                    </Col>
                    <Col n="12">
                        <NavLink href="/user/signup">
                            {`Je n'ai pas encore de compte`}
                        </NavLink>
                    </Col>
                    <Col n="12">
                        <NavLink href="/user/forgot-password">
                            {lostPasswordMsg}
                        </NavLink>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

export default SignIn;
