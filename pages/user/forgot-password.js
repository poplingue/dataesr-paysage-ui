import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import AuthForm from '../../components/AuthForm';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
import {
    codeSendByEmailMsg,
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

export default function ForgotPassword() {
    const router = useRouter();
    const validationSchema = Yup.object().shape({
        account: Yup.string()
            .required(`${emailMandatoryMsg}`)
            .email(`${emailErrorMsg}`),
    });

    const onSubmit = (formData) => {
        const { account } = formData;

        userService
            .forgotPassword(account)
            .then(() => {
                router
                    .push({
                        pathname: '/user/reset-password',
                        query: { email: account },
                    })
                    .then(() => {
                        NotifService.info(codeSendByEmailMsg, 'valid');
                    });
            })
            .catch((err) => {
                NotifService.info(err, 'error');

                return Promise.reject(err);
            });
    };

    return (
        <Layout>
            <HeaderLayout pageTitle="Renouveler mon mot de passe : étape 1/2" />
            <Container>
                <Row gutters>
                    <Col n="6">
                        <AuthForm
                            schema={formSchema}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
