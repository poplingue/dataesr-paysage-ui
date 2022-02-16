import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import grid from '../../../helpers/imports';
import {
    emailErrorMsg,
    emailMandatoryMsg,
    emailPattern,
    emailPatternHint,
    inactiveUserError,
    lostPasswordMsg,
    passwordMandatoryMsg,
} from '../../../helpers/internalMessages';
import authService from '../../../services/Auth.service';
import NotifService from '../../../services/Notif.service';

const AuthForm = dynamic(() => import('../../../components/AuthForm'));
const NavLink = dynamic(() => import('../../../components/NavLink'));
const HeaderLayout = dynamic(() => import('../../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../../components/Layout'));

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
    const { Col, Row, Container } = grid();
    const router = useRouter();

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
            .then(() => {
                window.location = '/';
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
