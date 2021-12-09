import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import * as Yup from 'yup';
import AuthForm from '../../components/AuthForm';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
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
        hint: '8 caractères minimum dont 1 chiffre, 1 caractère spécial, 1 majuscule',
    },
];

export default function ResetPassword() {
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        account: Yup.string()
            .required("L'email est obligatoire")
            .email("Format d'email incorrecte"),
        code: Yup.string()
            .required('Code d&apos;activation obligatoire')
            .matches('^(?=.*[0-9]).{6}$', 'Code non valide'),
        password: Yup.string()
            .required('Le mot de passe est obligatoire')
            .matches(
                '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$',
                '8 caractères minimum dont 1 chiffre, 1 caractère spécial, 1 majuscule'
            ),
    });

    const onSubmit = (formData) => {
        const { code, account, password } = formData;
        userService
            .resetPassword({ code, account, password })
            .then(() => {
                router.push('/user/sign-in').then(() => {
                    NotifService.info(
                        'Votre mot de pass a été modifié',
                        'valid'
                    );
                });
            })
            .catch((err) => {
                NotifService.info(err, 'error');
                console.error('==== ERR ==== ', err);
            });
    };

    return (
        <Layout>
            <HeaderLayout pageTitle="Renouveler mon mot de passe : étape 2/2" />
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
            <Toaster />
        </Layout>
    );
}
