import {
    Button,
    Callout,
    CalloutText,
    CalloutTitle,
    Col,
    Container,
    Row,
    Text,
} from '@dataesr/react-dsfr';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useWorkerObject from '../../../hooks/useWorkerObject';
import ObjectService from '../../../services/Object.service';
import Map from '../../Map';
import ShowMoreList from '../../ShowMoreList';

const CardInfo = dynamic(() => import('./../../../components/CardInfo'));

export default function Header() {
    const [mainLocation, setMainLocation] = useState({});
    const [mainName, setMainName] = useState({});
    const [identifiers, setIdentifiers] = useState([]);
    const [init, setInit] = useState(true);

    const {
        query: { id, type },
    } = useRouter();

    const router = useRouter();
    const { fetchObject, objectData } = useWorkerObject();

    useEffect(() => {
        // TODO use Promise.all for subObjects identifiers and localisations
        async function getData() {
            return (
                (await ObjectService.getSubObjectData(
                    type,
                    id,
                    'identifiers'
                )) || []
            );
        }

        if (!Object.keys(identifiers).length && init) {
            getData().then(({ data }) => {
                setIdentifiers(data);
                setInit(false);
            });
        }
    }, [id, identifiers, init, mainLocation, mainLocation.length, type]);

    useEffect(() => {
        async function getData() {
            // TODO pass await function as parameter??
            return (
                (await ObjectService.getSubObjectData(
                    type,
                    id,
                    'localisations'
                )) || []
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

    useEffect(() => {
        if (objectData) {
            const { currentName } = objectData;

            // check currentName not yet set
            if (currentName && !!Object.keys(currentName).length) {
                const proxy = new Proxy(
                    currentName,
                    ObjectService.handlerMainName()
                );
                setMainName(proxy);
            }
        }
    }, [objectData]);

    useEffect(() => {
        async function fetchStructure() {
            fetchObject(type, id);
        }

        if (id && init) {
            fetchStructure().then(() => {
                setInit(false);
            });
        }
    }, [fetchObject, id, init, type]);

    const renderIdentifiers = () => {
        return identifiers.map((identifier, i) => {
            const { length } = identifiers;
            const { type, value, id: identifierId } = identifier;

            return (
                <Col
                    key={identifierId}
                    n={length > 3 ? '4' : '6'}
                    spacing={i === length - 1 ? 'pb-8w' : ''}
                >
                    <CardInfo
                        onClick={() => {
                            router.push(
                                `/contrib/structure/${id}/${identifierId}`
                            );
                        }}
                        supInfo={type}
                        title={value}
                        actionLabel="Modifier"
                    />
                </Col>
            );
        });
    };

    const renderMap = () => {
        if (!mainLocation || !mainLocation.coordinates) {
            return null;
        }

        return (
            <Row>
                <Col spacing="pb-2w">
                    <Map
                        lat={mainLocation.coordinates.lat}
                        lng={mainLocation.coordinates.lng}
                        markers={[
                            {
                                address: mainLocation.fullAddress,
                                latLng: [
                                    mainLocation.coordinates.lat,
                                    mainLocation.coordinates.lng,
                                ],
                            },
                        ]}
                    />
                </Col>
            </Row>
        );
    };

    return (
        <Container>
            <Row gutters>
                <Col n="12">
                    <Container fluid>
                        {renderMap()}
                        <Row>
                            {mainLocation.telephone && (
                                <Col spacing="pb-8w pr-1w">
                                    <Callout
                                        hasInfoIcon={false}
                                        colorFamily="yellow-tournesol"
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
                                        colorFamily="yellow-tournesol"
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
                                        router.push(`/contrib/structure/${id}`);
                                    }}
                                    supInfo={`date de création sous le nom ${mainName.usualName}`}
                                    title={mainName.startDate}
                                    actionLabel="Modifier"
                                />
                            </Col>
                            <Col n="12">
                                <Row gutters>
                                    <Col>
                                        <Text size="lg">Identifiants</Text>
                                        <ShowMoreList
                                            display={identifiers.length}
                                        >
                                            {renderIdentifiers()}
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
