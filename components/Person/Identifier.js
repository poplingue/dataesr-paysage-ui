import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import grid from '../../helpers/imports';
import ObjectService from '../../services/Object.service';
import CardInfo from '../CardInfo';

export default function Identifiers() {
    const { Col, Row, Container } = grid();

    const {
        query: { id, type },
    } = useRouter();

    const router = useRouter();

    const [identifiers, setIdentifiers] = useState([]);
    const [init, setInit] = useState(true);

    useEffect(() => {
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
    }, [id, identifiers, init, type]);

    return (
        <>
            <Container fluid>
                <Row gutters spacing="px-2w pb-6w pt-2w">
                    <Col>
                        {identifiers.map((identifier) => {
                            return (
                                <CardInfo
                                    key={identifier.type}
                                    onClick={() => {
                                        router.push(
                                            `/contrib/person/${id}/${identifier.id}`
                                        );
                                    }}
                                    supInfo={identifier.type}
                                    title={identifier.value}
                                    actionLabel="Modifier"
                                />
                            );
                        })}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
