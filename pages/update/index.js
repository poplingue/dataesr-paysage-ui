import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import LinkClick from '../../components/LinkClick';
import Spinner from '../../components/Spinner';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import DBService from '../../services/DB.service';
import ObjectService from '../../services/Object.service';

const HeaderLayout = dynamic(() => import('./../../components/HeaderLayout'));
const Layout = dynamic(() => import('./../../components/Layout'));

export default function Update() {
    const { Col, Row, Container } = grid();
    const [spinner, setSpinner] = useState(false);
    const [currentObject, setCurrentObject] = useState('');
    const workerRef = useRef();

    const router = useRouter();
    const {
        stateForm: { updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    useEffect(() => {
        // New Service Worker
        workerRef.current = new Worker('/service-worker.js', {
            name: 'New_object',
            type: 'module',
        });
    }, []);

    useEffect(() => {
        // SW LISTEN event: Init new Object
        workerRef.current.onmessage = ({ data }) => {
            ObjectService.newId(data).then((id) => {
                dispatch({
                    type: 'CLEAR_FORM',
                    payload: { formName: `update/${currentObject}` },
                });

                if (id) {
                    router.push(`/update/${currentObject}/${id}`);
                }
            });
        };
    }, [currentObject, dispatch, router, workerRef]);

    const onClick = async (e, object) => {
        e.preventDefault();

        setSpinner(true);

        // Clear current object
        await DBService.clear(`update/${object}`).then(() => {
            setCurrentObject(object);

            // SW POST event: Init new Object
            workerRef.current.postMessage({
                object,
            });

            Cookies.remove('updateObjectId');
        });
    };

    return (
        <Layout>
            <HeaderLayout pageTitle="Ajouter un nouvel objet Paysage" />
            <Container>
                <Row gutters spacing="px-2w">
                    <Col n="12">
                        {spinner ? (
                            <Spinner active small>
                                Créer un nouvel Établissement
                            </Spinner>
                        ) : (
                            <LinkClick
                                dataCy="update/structure"
                                href="/update/structure"
                                onClick={(e) => onClick(e, 'structure')}
                                text="Créer un nouvel Établissement"
                            />
                        )}
                    </Col>
                    {updateObjectId && (
                        <Col>
                            <LinkClick
                                href={`/update/structure/${updateObjectId}`}
                                text={`Reprendre la modification de ${updateObjectId}`}
                            />
                        </Col>
                    )}
                </Row>
            </Container>
        </Layout>
    );
}
