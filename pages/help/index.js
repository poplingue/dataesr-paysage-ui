import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useContext } from 'react';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
import NavLink from '../../components/NavLink';
import { AppContext } from '../../context/GlobalState';

export default function Help() {
    const {
        statePage: { userConnected },
    } = useContext(AppContext);

    return (
        <Layout>
            <HeaderLayout pageTitle="Aide" />
            <Container>
                <Row gutters>
                    <Col n="12">
                        <NavLink
                            href={
                                userConnected
                                    ? '/user/renewal-code'
                                    : '/user/sign-in'
                            }
                        >
                            Recevoir un nouveau code d&apos;activation
                        </NavLink>
                    </Col>
                    <Col n="12">
                        <NavLink href="/user/activate-account">
                            Activer mon compte avec le code à 6 chiffres
                        </NavLink>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
