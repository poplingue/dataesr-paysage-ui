import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { useContext, useEffect, useRef, useState } from 'react';
import LinkClick from '../../components/LinkClick';
import Spinner from '../../components/Spinner';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import ObjectService from '../../services/Object.service';

const HeaderLayout = dynamic(() => import('./../../components/HeaderLayout'));
const Layout = dynamic(() => import('./../../components/Layout'));

export default function Update() {
    const { Col, Row, Container } = grid();
    // TODO spinner in globalState
    const [spinner, setSpinner] = useState(false);
    const [currentObject, setCurrentObject] = useState('');
    const workerRef = useRef();

    const router = useRouter();
    const { dispatchForm: dispatch } = useContext(AppContext);

    useEffect(() => {
        workerRef.current = new Worker('sw.js', {
            name: 'New_object',
            type: 'module',
        });
    }, []);

    useEffect(() => {
        workerRef.current.onmessage = ({ data }) => {
            ObjectService.newId(data).then((id) => {
                if (id) {
                    router.push(`/update/${currentObject}/${id}`);
                }
            });
        };
    }, [currentObject, router, workerRef]);

    const onClick = (e, object) => {
        e.preventDefault();

        setSpinner(true);

        workerRef.current.postMessage({
            type: object,
        });

        setCurrentObject(object);

        destroyCookie(null, 'updateObjectId');

        dispatch({
            type: 'UPDATE_UPDATE_OBJECT_ID',
            payload: { updateObjectId: '' },
        });
    };

    return (
        <Layout>
            <HeaderLayout pageTitle="Ajouter un nouvel objet Paysage" />
            <Container>
                <Row gutters spacing="px-2w">
                    <Col n="12" className="p-relative">
                        <LinkClick
                            href="/update/structure"
                            onClick={(e) => onClick(e, 'structure')}
                            text="Créer un nouvel Établissement"
                        />
                        {spinner && <Spinner />}
                    </Col>
                    <Col n="12">
                        <LinkClick
                            href="/update/person"
                            onClick={(e) => onClick(e, 'person')}
                            text="Créer une nouvelle Personne"
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
