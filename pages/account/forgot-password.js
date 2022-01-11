import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import grid from '../../helpers/imports';
import {
    codeSendByEmailMsg,
    emailErrorMsg,
    emailMandatoryMsg,
} from '../../helpers/internalMessages';
import authService from '../../services/Auth.service';
import NotifService from '../../services/Notif.service';

const AuthForm = dynamic(() => import('../../components/AuthForm'));
const HeaderLayout = dynamic(() => import('../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../components/Layout'));

const formSchema = [
    {
        required: true,
        label: 'Email',
        type: 'email',
        name: 'account',
    },
];

export default function ForgotPassword() {
    const { Col, Row, Container } = grid();

    const router = useRouter();
    const validationSchema = Yup.object().shape({
        account: Yup.string()
            .required(`${emailMandatoryMsg}`)
            .email(`${emailErrorMsg}`),
    });

    const onSubmit = (formData) => {
        const { account } = formData;

        authService
            .forgotPassword(account)
            .then(() => {
                router
                    .push({
                        pathname: '/account/reset-password',
                        query: { email: account },
                    })
                    .then(() => {
                        NotifService.info(codeSendByEmailMsg, 'valid');
                    });
            })
            .catch((err) => {
                console.error('==== authService.forgotPassword ==== ', err);
                NotifService.info(err, 'error');

                return Promise.reject(err);
            });
    };

    return (
        <Layout>
            <HeaderLayout pageTitle="Renouveler mon mot de passe : étape 1/2" />
            <Container>
                <Row gutters>
                    <Col n="12 md-6">
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
