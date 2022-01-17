import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import * as Yup from 'yup';
import { AppContext } from '../../../context/GlobalState';
import grid from '../../../helpers/imports';
import {
    activateAdviceMsg,
    activationCodePattern,
    codeMandatoryMsg,
    connectAdviceMsg,
    inactiveUserError,
    tokenMissingError,
} from '../../../helpers/internalMessages';
import authService from '../../../services/Auth.service';
import NotifService from '../../../services/Notif.service';

const AuthForm = dynamic(() => import('../../../components/AuthForm'));
const FieldButton = dynamic(() => import('../../../components/FieldButton'));
const HeaderLayout = dynamic(() => import('../../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../../components/Layout'));

const formSchema = [
    {
        required: true,
        label: `Code d\'activation`,
        name: 'activationCode',
        hint: 'Code à 6 chiffres reçu par mail',
    },
];

export default function Activate() {
    const { Col, Row, Container } = grid();

    const router = useRouter();
    const {
        statePage: { error },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        activationCode: Yup.string()
            .required(codeMandatoryMsg)
            .matches(activationCodePattern, 'Code non valide'),
    });

    useEffect(() => {
        if (error && error === inactiveUserError) {
            NotifService.info(activateAdviceMsg, 'neutral', 10000);
        }
    }, [error, router]);

    const getNewCode = () => {
        authService
            .renewActivationCode()
            .then(({ data }) => {
                const a = data.message.split(' ');
                const email = a[a.length - 1];

                NotifService.info(
                    `Un nouveau code a été envoyé à ${email}`,
                    'valid'
                );
            })
            .catch((err) => {
                console.error(
                    '==== authService.renewActivationCode ==== ',
                    err
                );

                // Todo still useful??
                if (err === tokenMissingError) {
                    router.push('/account/sign-in').then(() => {
                        NotifService.info(connectAdviceMsg, 'neutral', 6000);
                    });
                }
            });
    };

    const onSubmit = (formData) => {
        authService
            .activate(formData)
            .then(() => {
                authService.signOut().then(() => {
                    dispatch({
                        type: 'UPDATE_ERROR',
                        payload: '',
                    });

                    dispatch({
                        type: 'UPDATE_USER_CONNECTION',
                        payload: false,
                    });

                    if (Cookies && Cookies.get('userConnected')) {
                        Cookies.set('userConnected', false);
                    }

                    router.push('/account/sign-in').then(() => {
                        NotifService.info(
                            'Compte activé, connectez-vous',
                            'valid'
                        );
                    });
                });
            })
            .catch((err) => {
                console.error('==== authService.activate ==== ', err);
                NotifService.info(err, 'error');

                return Promise.reject(err);
            });
    };

    return (
        <Layout headTitle="Paysage - Activer mon compte">
            <HeaderLayout pageTitle="Activer mon compte" />
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
                        <FieldButton
                            title="Recevoir un nouveau code d'activation"
                            onClick={getNewCode}
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
