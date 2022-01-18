import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import grid from '../../../helpers/imports';
import {
    activationCodePattern,
    codeMandatoryMsg,
    emailErrorMsg,
    emailMandatoryMsg,
    emailPattern,
    emailPatternHint,
    passwordMandatoryMsg,
} from '../../../helpers/internalMessages';
import authService from '../../../services/Auth.service';
import NotifService from '../../../services/Notif.service';

const AuthForm = dynamic(() => import('../../../components/AuthForm'));
const HeaderLayout = dynamic(() => import('../../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../../components/Layout'));

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
    const { Col, Row, Container } = grid();

    const router = useRouter();
    const { email } = router.query;

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

        authService
            .resetPassword({ code, account, password })
            .then(() => {
                authService.signIn({ account, password }).then(async () => {
                    router.push('/').then(() => {
                        Cookies.set('userConnected', true);
                        NotifService.info('Mot de passe mis à jour', 'valid');
                    });
                });
            })
            .catch((err) => {
                console.log('==== resetPassword error ==== ', err);
                NotifService.info(err, 'error');
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
