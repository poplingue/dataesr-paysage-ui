import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import * as Yup from 'yup';
import AuthForm from '../../components/AuthForm';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
import { AppContext } from '../../context/GlobalState';
import {
    activationCodePattern,
    codeMandatoryMsg,
    connectedMsg,
    emailErrorMsg,
    emailMandatoryMsg,
    emailPattern,
    emailPatternHint,
    passwordMandatoryMsg,
} from '../../helpers/internalMessages';
import NotifService from '../../services/Notif.service';
import { userService } from '../../services/User.service';

const formSchema = [
    {
        required: true,
        label: 'Email',
        type: 'email',
        name: 'account',
    },
    {
        required: true,
        label: `Code de sécurité`,
        name: 'code',
        hint: 'Code à 6 chiffres reçu par mail',
    },
    {
        label: 'Nouveau mot de passe',
        name: 'password',
        type: 'password',
        required: true,
        hint: `${emailPatternHint}`,
    },
];

export default function ResetPassword() {
    const router = useRouter();
    const { email } = router.query;
    const { dispatchPage: dispatch } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        account: Yup.string()
            .required(`${emailMandatoryMsg}`)
            .email(`${emailErrorMsg}`),
        code: Yup.string()
            .required(codeMandatoryMsg)
            .matches(activationCodePattern, 'Code non valide'),
        password: Yup.string()
            .required(`${passwordMandatoryMsg}`)
            .matches(`${emailPattern}`, `${emailPatternHint}`),
    });

    const onSubmit = (formData) => {
        const { code, password, account } = formData;

        userService
            .resetPassword({ code, account, password })
            .then(() => {
                userService
                    .signIn({ account, password })
                    .then(() => {
                        dispatch({
                            type: 'UPDATE_USER_CONNECTION',
                            payload: { userConnected: true },
                        });

                        router.push('/').then(() => {
                            NotifService.info(connectedMsg, 'valid');

                            // TODO /me instead of reload
                            router.reload();
                        });
                    })
                    .catch((err) => {
                        console.error('==== userService.signIn ==== ', err);
                        NotifService.info(err, 'error');
                    });
            })
            .catch((err) => {
                console.error('==== userService.resetPassword ==== ', err);
                NotifService.info(err, 'error');

                return Promise.reject(err);
            });
    };

    return (
        <Layout>
            <HeaderLayout pageTitle="Renouveler mon mot de passe : étape 2/2" />
            <Container>
                <Row gutters>
                    <Col n="12 md-6">
                        <AuthForm
                            schema={formSchema.map((elm) => {
                                return elm.name === 'account'
                                    ? {
                                          ...elm,
                                          value: email,
                                          disabled: !!email,
                                      }
                                    : elm;
                            })}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
