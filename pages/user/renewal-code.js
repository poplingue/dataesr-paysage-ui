import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import AuthForm from '../../components/AuthForm';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
import { AppContext } from '../../context/GlobalState';
import {
    emailErrorMsg,
    emailMandatoryMsg,
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
];

export default function RenewalCode() {
    const router = useRouter();

    const {
        statePage: { user },
    } = useContext(AppContext);

    const validationSchema = Yup.object().shape({
        account: Yup.string()
            .required(`${emailMandatoryMsg}`)
            .email(`${emailErrorMsg}`),
    });

    const onSubmit = (formData) => {
        debugger; // eslint-disable-line

        if (user.active) {
            NotifService.info('Votre compte est déjà actif', 'error');

            return;
        }

        userService
            .renewalCode(formData)
            .then(() => {
                router.push('/user/activate-account').then(() => {
                    NotifService.info(
                        'Un email contenant le code à 6 chiffres vous a été envoyé',
                        'valid'
                    );
                });
            })
            .catch((err) => {
                NotifService.info(err, 'error');

                return Promise.reject(err);
            });
    };

    return (
        <Layout>
            <HeaderLayout pageTitle="Recevoir un nouveau code d'activation" />
            <Container>
                <Row gutters>
                    <Col n="6">
                        <AuthForm
                            schema={formSchema}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                            disable={user.active}
                        />
                    </Col>
                </Row>
            </Container>
            <Toaster />
        </Layout>
    );
}
