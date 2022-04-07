import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import LinkClick from '../../components/LinkClick';
import { subObjects } from '../../config/objects';
import { getObjectTypeDetails } from '../../config/utils';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import DBService from '../../services/DB.service';
import ObjectService from '../../services/Object.service';

const Select = dynamic(() =>
    import('@dataesr/react-dsfr').then((mod) => mod.Select)
);
const HeaderLayout = dynamic(() => import('./../../components/HeaderLayout'));
const Spinner = dynamic(() => import('../../components/Spinner'));
const Layout = dynamic(() => import('./../../components/Layout'));

export default function Contrib() {
    const { Col, Row, Container } = grid();
    const [spinner, setSpinner] = useState(false);
    // TODO remove
    const [currentFormObject, setCurrentObject] = useState('');
    const workerRef = useRef();
    const [objectType, setObjectType] = useState('structure');

    const router = useRouter();
    const { dispatchForm: dispatch } = useContext(AppContext);

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
                    payload: { formName: `contrib/${currentFormObject}` },
                });

                if (id) {
                    router.push(`/contrib/${currentFormObject}/${id}`);
                }
            });
        };
    }, [currentFormObject, dispatch, router, workerRef]);

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
                                setObjectType(e.target.value);
                            }}
                            selected={objectType}
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
                                dataCy={`contrib/${objectType}`}
                                href={`/contrib/${objectType}`}
                                onClick={(e) => onClick(e, objectType)}
                                text={`Créer un nouvel objet « ${
                                    getObjectTypeDetails('', objectType).title
                                } »`}
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
