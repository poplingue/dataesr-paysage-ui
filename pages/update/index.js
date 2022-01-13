import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { destroyCookie, parseCookies } from 'nookies';
import { useContext, useEffect, useRef } from 'react';
import LinkClick from '../../components/LinkClick';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import ObjectService from '../../services/Object.service';

const HeaderLayout = dynamic(() => import('./../../components/HeaderLayout'));
const Layout = dynamic(() => import('./../../components/Layout'));

export default function Create() {
    const { Col, Row, Container } = grid();
    const workerRef = useRef();
    const cookies = parseCookies();

    const router = useRouter();
    const { dispatchForm: dispatch } = useContext(AppContext);

    useEffect(() => {
        workerRef.current = new Worker('sw.js', {
            name: 'Update_object',
            type: 'module',
        });
    }, []);

    useEffect(() => {
        workerRef.current.onmessage = (event) => {
            ObjectService.new(event);
        };
    }, [workerRef]);

    const onClick = (e, url) => {
        e.preventDefault();

        destroyCookie(null, 'updateObjectId');

        dispatch({
            type: 'UPDATE_UPDATE_OBJECT_ID',
            payload: { updateObjectId: '' },
        });

        if (cookies.tokens) {
            workerRef.current.postMessage({
                type: 'structure',
                accessToken: JSON.parse(cookies.tokens).accessToken,
            });
        }

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
                            onClick={(e) => onClick(e, '/update/structure')}
                            text="Créer un nouvel Établissement"
                        />
                    </Col>
                    <Col n="12">
                        <LinkClick
                            href="/update/person"
                            onClick={(e) => onClick(e, '/update/person')}
                            text="Créer une nouvelle Personne"
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
