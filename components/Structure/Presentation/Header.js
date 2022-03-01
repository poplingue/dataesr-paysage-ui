import {
    Button,
    Callout,
    CalloutText,
    CalloutTitle,
    Col,
    Container,
    Row,
} from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { niceFullDate } from '../../../helpers/utils';
import ObjectService from '../../../services/Object.service';
import CardInfo from '../../CardInfo';
import Map from '../../Map';

export default function Header() {
    const [mainLocation, setMainLocation] = useState({});
    const [identifiers, setIdentifiers] = useState([]);

    const {
        query: { id, type },
    } = useRouter();

    const router = useRouter();

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
                                    supInfo="date de création"
                                    title={niceFullDate(mainLocation.startDate)}
                                    actionLabel="Modifier"
                                />
                            </Col>
                            {identifiers.map((identifier, i) => {
                                return (
                                    <Col
                                        key={identifier.id}
                                        n="4"
                                        spacing={
                                            i === identifiers.length - 1
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
                                            supInfo={identifier.type}
                                            title={identifier.value}
                                            actionLabel="Modifier"
                                        />
                                    </Col>
                                );
                            })}
                        </Row>

                        <Row>
                            <Col>
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
