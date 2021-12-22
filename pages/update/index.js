import { Col, Container, Row } from '@dataesr/react-dsfr';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import HeaderLayout from '../../components/HeaderLayout';
import Layout from '../../components/Layout';
import LinkClick from '../../components/LinkClick';
import { AppContext } from '../../context/GlobalState';

export default function Create() {
    const router = useRouter();
    const { dispatchForm: dispatch } = useContext(AppContext);

    const onClick = (url) => {
        Cookies.remove('updateObjectId');
        dispatch({
            type: 'UPDATE_UPDATE_OBJECT_ID',
            payload: { updateObjectId: '' },
        });

        router.push(url);
    };

    return (
        <Layout>
            <HeaderLayout pageTitle="Ajouter un nouvel objet Paysage" />
            <Container>
                <Row gutters spacing="px-2w">
                    <Col n="12">
                        <LinkClick
                            href="/update/structure"
                            onClick={() => onClick('/update/structure')}
                            text="Créer un nouvel Établissement"
                        />
                    </Col>
                    <Col n="12">
                        <LinkClick
                            href="/update/person"
                            onClick={() => onClick('/update/person')}
                            text="Créer une nouvelle Personne"
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
