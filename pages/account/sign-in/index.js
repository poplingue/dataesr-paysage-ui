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
    activateAdviceMsg,
    connectedMsg,
    emailErrorMsg,
    emailMandatoryMsg,
    emailPattern,
    emailPatternHint,
    inactiveUserError,
    lostPasswordMsg,
    passwordMandatoryMsg,
} from '../../../helpers/internalMessages';
import { authService } from '../../../services/Auth.service';
import NotifService from '../../../services/Notif.service';

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
    const {
        statePage: { error, user },
    } = useContext(AppContext);

    useEffect(() => {
        if (error && error === inactiveUserError) {
            router.push('/account/activate-account').then(() => {
                NotifService.info(activateAdviceMsg, 'neutral', 10000);
            });
        }
    }, [error, router, user]);

    const validationSchema = Yup.object().shape({
        account: Yup.string()
            .required(`${emailMandatoryMsg}`)
            .email(`${emailErrorMsg}`),
        password: Yup.string()
            .required(`${passwordMandatoryMsg}`)
            .matches(`${emailPattern}`, `${emailPatternHint}`),
    });

    const onSubmit = (formData) => {
        authService
            .signIn(formData)
            .then(async () => {
                router.push('/').then(() => {
                    Cookies.set('userConnected', true);
                    NotifService.info(connectedMsg, 'valid');
                    window.location.reload();
                });
            })
            .catch((err) => {
                console.error('==== authService.signIn ==== ', err);
                NotifService.info(err, 'error');

                if (err === inactiveUserError) {
                    router.push('/account/activate-account').then(() => {
                        NotifService.info('Activez votre compte', 'valid');
                    });
                }
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
                        <NavLink href="/account/signup">
                            {`Je n'ai pas encore de compte`}
                        </NavLink>
                    </Col>
                    <Col n="12">
                        <NavLink href="/account/forgot-password">
                            {lostPasswordMsg}
                        </NavLink>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

export default SignIn;