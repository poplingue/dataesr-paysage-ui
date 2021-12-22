import { Col, Container, Row } from '@dataesr/react-dsfr';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import * as Yup from 'yup';
import AuthForm from '../../components/AuthForm';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
import NavLink from '../../components/NavLink';

import {
    emailErrorMsg,
    emailMandatoryMsg,
    emailPattern,
    emailPatternHint,
    passwordMandatoryMsg,
} from '../../helpers/internalMessages';
import authService from '../../services/Auth.service';
import NotifService from '../../services/Notif.service';

const formSchema = [
    {
        name: 'firstName',
        label: 'Prénom',
        required: true,
    },
    {
        name: 'lastName',
        label: 'Nom',
        required: true,
    },
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        required: true,
    },
    {
        label: 'Mot de passe',
        name: 'password',
        type: 'password',
        required: true,
        hint: `${emailPatternHint}`,
    },
    {
        label: 'Confirmation de mot passe',
        name: 'confirm_password',
        type: 'password',
        required: true,
    },
    {
        label: 'Pseudo',
        name: 'username',
        required: true,
    },
];

const errorsIntl = {
    'email already exists.': (email) => `L'email ${email} est déjà utilisé`,
    'username already exists.': (username) =>
        `Le pseudo ${username} est déjà utilisé`,
};

function Signup() {
    const router = useRouter();

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required('Le pseudo est obligatoire')
            .matches('^(?=.*[aA-zZ]).{2,26}$', 'Format invalide'),
        email: Yup.string()
            .required(`${emailMandatoryMsg}`)
            .email(`${emailErrorMsg}`),
        password: Yup.string()
            .required(`${passwordMandatoryMsg}`)
            .matches(`${emailPattern}`, `${emailPatternHint}`),
        firstName: Yup.string()
            .required('Le prénom est obligatoire')
            .matches('^(?=.*[aA-zZ]).{2,26}$', 'Format invalide'),
        lastName: Yup.string()
            .required('Le nom est obligatoire')
            .matches('^(?=.*[aA-zZ]).{2,26}$', 'Format invalide'),
        confirm_password: Yup.string()
            .required()
            .oneOf(
                [Yup.ref('password'), null],
                'Les mots de passe ne sont pas identiques'
            ),
    });

    useEffect(() => {
        if (Cookies.get('tokens')) {
            Cookies.remove('tokens');
        }
    }, []);

    const onSubmit = (formData) => {
        const {
            password,
            email,
            firstName,
            lastName,
            username,
            confirm_password,
        } = formData;

        if (password === confirm_password) {
            authService
                .signup({ email, password, firstName, lastName, username })
                .then(() => {
                    router.push('/account/activate-account').then(() => {
                        NotifService.info(
                            'Vous avez reçu un code par mail',
                            'valid'
                        );
                    });
                })
                .catch((err) => {
                    const field = err.indexOf('email') >= 0 ? email : username;
                    const errorFr = errorsIntl[err](field);

                    NotifService.info(errorFr, 'error');
                });
        }
    };

    return (
        <Layout headTitle="Paysage - Créer un compte">
            <HeaderLayout pageTitle="Créer un compte Paysage" />
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
                        <NavLink href="/account/sign-in">
                            {`J'ai déjà un compte`}
                        </NavLink>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

export default Signup;
