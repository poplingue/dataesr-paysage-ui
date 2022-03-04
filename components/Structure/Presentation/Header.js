import {
    Button,
    Callout,
    CalloutText,
    CalloutTitle,
    Col,
    Container,
    Row,
} from '@dataesr/react-dsfr';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import ObjectService from '../../../services/Object.service';
import Map from '../../Map';
import ShowMoreList from '../../ShowMoreList';

const CardInfo = dynamic(() => import('./../../../components/CardInfo'));

export default function Header() {
    const [mainLocation, setMainLocation] = useState({});
    const [mainName, setMainName] = useState({});
    const [identifiers, setIdentifiers] = useState([]);

    const {
        query: { id, type },
    } = useRouter();

    const router = useRouter();
    const workerRef = useRef();

    useEffect(() => {
        // TODO use Promise.all
        async function getData() {
            return (
                (await ObjectService.getSubObject(type, id, 'identifiers')) ||
                []
            );
        }

        if (!Object.keys(identifiers).length) {
            getData().then(({ data }) => {
                setIdentifiers(data);
            });
        }
    }, [id, identifiers, mainLocation, mainLocation.length, type]);

    useEffect(() => {
        async function getData() {
            return (
                (await ObjectService.getSubObject(type, id, 'localisations')) ||
                []
            );
        }

        if (!Object.keys(mainLocation).length) {
            getData().then(({ data }) => {
                if (!!data.length) {
                    const proxy = new Proxy(
                        data[0],
                        ObjectService.handlerMainLocalisation()
                    );
                    setMainLocation(proxy);
                }
            });
        }
    }, [id, mainLocation, type]);

    // TODO refacto - make a hook
    useEffect(() => {
        // TODO make a hook
        workerRef.current = new Worker('/service-worker.js', {
            name: 'Get_object',
            type: 'module',
        });
    }, []);

    useEffect(() => {
        workerRef.current.onmessage = async ({ data }) => {
            // TODO add check data
            if (data && JSON.parse(data).data) {
                if (!!Object.keys(JSON.parse(data).data.currentName).length) {
                    const proxy = new Proxy(
                        JSON.parse(data).data.currentName,
                        ObjectService.handlerMainName()
                    );
                    setMainName(proxy);
                }
            }
        };
    });

    useEffect(() => {
        async function fetchStructure() {
            workerRef.current.postMessage({
                object: type,
                id,
            });
        }

        if (id) {
            fetchStructure();
        }
    }, [id, type]);

    return (
        <Container>
            <Row gutters>
                <Col n="12">
                    <Container fluid>
                        <Row>
                            {mainLocation && mainLocation.geometry && (
                                <Col spacing="pb-2w">
                                    <Map
                                        lat={
                                            mainLocation.geometry.coordinates[0]
                                        }
                                        lng={
                                            mainLocation.geometry.coordinates[1]
                                        }
                                        markers={[
                                            {
                                                address:
                                                    mainLocation.fullAddress,
                                                latLng: [
                                                    mainLocation.geometry
                                                        .coordinates[1],
                                                    mainLocation.geometry
                                                        .coordinates[0],
                                                ],
                                            },
                                        ]}
                                    />
                                </Col>
                            )}
                        </Row>
                        <Row>
                            {mainLocation.telephone && (
                                <Col spacing="pb-8w pr-1w">
                                    <Callout
                                        hasInfoIcon={false}
                                        colorFamily="green-tilleul-verveine"
                                    >
                                        <CalloutTitle>Téléphone</CalloutTitle>
                                        <CalloutText size="md">
                                            {mainLocation.telephone}
                                        </CalloutText>
                                    </Callout>
                                </Col>
                            )}
                            {mainLocation.fullAddress && (
                                <Col spacing="pb-8w">
                                    <Callout
                                        hasInfoIcon={false}
                                        colorFamily="green-tilleul-verveine"
                                    >
                                        <CalloutTitle>Adresse</CalloutTitle>
                                        <CalloutText size="md">
                                            {mainLocation.fullAddress}
                                        </CalloutText>
                                    </Callout>
                                </Col>
                            )}
                        </Row>
                        <Row gutters>
                            <Col n="4">
                                <CardInfo
                                    onClick={() => {
                                        router.push(`/update/structure/${id}`);
                                    }}
                                    supInfo={`date de création sous le nom ${mainName.usualName}`}
                                    title={mainName.startDate}
                                    actionLabel="Modifier"
                                />
                            </Col>
                            <Col n="12">
                                <Row gutters>
                                    <Col>
                                        <ShowMoreList
                                            display={identifiers.length}
                                        >
                                            {identifiers.map(
                                                (identifier, i) => {
                                                    return (
                                                        <Col
                                                            key={identifier.id}
                                                            n={
                                                                identifiers.length >
                                                                3
                                                                    ? '4'
                                                                    : '6'
                                                            }
                                                            spacing={
                                                                i ===
                                                                identifiers.length -
                                                                    1
                                                                    ? 'pb-8w'
                                                                    : ''
                                                            }
                                                        >
                                                            <CardInfo
                                                                onClick={() => {
                                                                    router.push(
                                                                        `/update/structure/${id}`
                                                                    );
                                                                }}
                                                                supInfo={
                                                                    identifier.type
                                                                }
                                                                title={
                                                                    identifier.value
                                                                }
                                                                actionLabel="Modifier"
                                                            />
                                                        </Col>
                                                    );
                                                }
                                            )}
                                        </ShowMoreList>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Col n="12">
                                <Callout hasInfoIcon={false}>
                                    <CalloutTitle>
                                        Contacts génériques
                                    </CalloutTitle>
                                    <CalloutText size="md" as="ul">
                                        <li>Contact 1</li>
                                        <li>Contact 2</li>
                                        <li>Contact 3</li>
                                    </CalloutText>
                                    <div>
                                        <Button
                                            // size="sm"
                                            title="Voir tout"
                                            icon="ri-eye-2-line"
                                        >
                                            Voir tout
                                        </Button>
                                    </div>
                                </Callout>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}
