import { Tag } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import grid from '../../../helpers/imports';
import ObjectService from '../../../services/Object.service';

export default function Web({}) {
    const { Col, Row, Container } = grid();

    const [weblinks, setWeblinks] = useState([]);
    const [init, setInit] = useState(true);

    const {
        query: { id, type },
    } = useRouter();

    useEffect(() => {
        async function getData() {
            return (
                (await ObjectService.getSubObjectData(type, id, 'weblinks')) ||
                []
            );
        }

        if (!Object.keys(weblinks).length && init) {
            getData().then(({ data }) => {
                setWeblinks(data);
                setInit(false);
            });
        }
    }, [id, init, type, weblinks]);

    return (
        <Container>
            <Row gutters>
                {weblinks.map((weblink) => {
                    return (
                        <Col n="2" key={weblink.id}>
                            <Tag
                                href={weblink.url}
                                icon="ri-external-link-line"
                            >
                                {weblink.url}
                            </Tag>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
}
