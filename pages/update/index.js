import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import LinkClick from '../../components/LinkClick';
import Spinner from '../../components/Spinner';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { connectToAccessMsg } from '../../helpers/internalMessages';
import NotifService from '../../services/Notif.service';
import ObjectService from '../../services/Object.service';

const HeaderLayout = dynamic(() => import('./../../components/HeaderLayout'));
const Layout = dynamic(() => import('./../../components/Layout'));

export default function Update() {
    const tokens = Cookies.get('tokens');
    const userConnected = Cookies.get('userConnected');
    const { Col, Row, Container } = grid();
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
        console.log('==== LOG ==== ', tokens, userConnected);

        if (!tokens || !userConnected) {
            // TODO manage in a service page access checker
            router.push('/account/sign-in').then(() => {
                NotifService.info(connectToAccessMsg, 'valid');
            });
        }
    }, [router, tokens, userConnected]);

    useEffect(() => {
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

    const onClick = (e, object) => {
        e.preventDefault();

        setSpinner(true);

        setCurrentObject(object);

        workerRef.current.postMessage({
            object,
        });

        Cookies.remove('updateObjectId');
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
                                href="/update/structure"
                                onClick={(e) => onClick(e, 'structure')}
                                text="Créer un nouvel Établissement"
                            />
                        )}
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
