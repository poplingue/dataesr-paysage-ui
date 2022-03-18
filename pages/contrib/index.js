import { Select } from '@dataesr/react-dsfr';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import LinkClick from '../../components/LinkClick';
import Spinner from '../../components/Spinner';
import { subObjects } from '../../config/objects';
import { getObjectTypeDetails } from '../../config/utils';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import DBService from '../../services/DB.service';
import ObjectService from '../../services/Object.service';

const HeaderLayout = dynamic(() => import('./../../components/HeaderLayout'));
const Layout = dynamic(() => import('./../../components/Layout'));

export default function Update() {
    const { Col, Row, Container } = grid();
    const [spinner, setSpinner] = useState(false);
    // TODO remove
    const [currentObject, setCurrentObject] = useState('');
    const workerRef = useRef();
    const [typeObject, setTypeObject] = useState('structure');

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
                    payload: { formName: `contrib/${currentObject}` },
                });

                if (id) {
                    router.push(`/contrib/${currentObject}/${id}`);
                }
            });
        };
    }, [currentObject, dispatch, router, workerRef]);

    const onClick = async (e, object) => {
        e.preventDefault();

        setSpinner(true);

        // Clear current object
        await DBService.clear(`contrib/${object}`).then(() => {
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
                <Row gutters spacing="px-2w" alignItems="bottom">
                    <Col n="6">
                        <Select
                            onChange={(e) => {
                                setTypeObject(e.target.value);
                            }}
                            selected={typeObject}
                            label={`Type d'objet`}
                            options={[
                                ...Array(Object.keys(subObjects).length).keys(),
                            ].map((object, i) => {
                                const { title: label, name: value } =
                                    getObjectTypeDetails(i);

                                return { label, value };
                            })}
                        />
                    </Col>
                    <Col n="6">
                        {spinner ? (
                            <Spinner active small>
                                {`C'est parti !`}
                            </Spinner>
                        ) : (
                            <LinkClick
                                dataCy={`contrib/${typeObject}`}
                                href={`/contrib/${typeObject}`}
                                onClick={(e) => onClick(e, typeObject)}
                                text={`Créer un nouvel objet « ${
                                    getObjectTypeDetails('', typeObject).title
                                } »`}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
