import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import * as Yup from 'yup';
import AuthForm from '../../../components/AuthForm';
import HeaderLayout from '../../../components/HeaderLayout';
import Layout from '../../../components/Layout';
import { AppContext } from '../../../context/GlobalState';
import {
    activationCodePattern,
    codeMandatoryMsg,
    connectedMsg,
    emailErrorMsg,
    emailMandatoryMsg,
    emailPattern,
    emailPatternHint,
    passwordMandatoryMsg,
} from '../../../helpers/internalMessages';
import NotifService from '../../../services/Notif.service';
import { userService } from '../../../services/User.service';

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

export default function Index() {
    const router = useRouter();
    const { email } = router.query;
    const {
        statePage: { error },
        dispatchPage: dispatch,
    } = useContext(AppContext);

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

    useEffect(() => {
        console.log('==== useEffect ERROR ==== ', error);

        if (error === 'No tokens') {
            // router.push('/forgot-password').then(() => {
            NotifService.info(error, 'neutral');
            // });
        }
    }, [error, router]);

    const onSubmit = (formData) => {
        const { code, password, account } = formData;

        userService.resetPassword({ code, account, password }).then(() => {
            router.push('/').then(() => {
                NotifService.info('Mot de passe mis à jour', 'valid');
                // window.location.reload();
                console.log('==== Mot de passe mis à jour ==== ');
                // try {
                userService.signIn({ account, password }).then((response) => {
                    debugger; // eslint-disable-line

                    NotifService.info(connectedMsg, 'valid');

                    console.log('==== signIn ==== ', response);

                    // dispatch({
                    //     type: 'UPDATE_ERROR',
                    //     payload: { error: '' },
                    // });
                    //
                    // dispatch({
                    //     type: 'UPDATE_USER_CONNECTION',
                    //     payload: { userConnected: true },
                    // });

                    // Cookies.set('userConnected', true);

                    // console.log('==== Cookies userConnected ==== ');

                    // const { data } = userService.me(Cookies.get('tokens')).then(() => {
                    //
                    //     console.log('==== DATA /me ==== ', data);
                    //
                    //     dispatch({
                    //         type: 'UPDATE_USER',
                    //         payload: { user: data },
                    //     });
                    //
                    //     return Promise.resolve(response);
                    // });

                    // }).catch((err) => {
                    //     debugger; // eslint-disable-line
                    //     console.log('==== signIn Error ==== ', err);
                    //     NotifService.info(err, 'error');
                    //
                    //     return Promise.reject(err);
                });
                // } catch (err) {
                //     debugger; // eslint-disable-line
                //     console.log('==== me Error ==== ', err);
                //
                //     return Promise.reject(err);
                // }
            });
            // }).catch((err) => {
            // console.log('==== resetPassword error ==== ', err);
            // NotifService.info(err, 'error');
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
