import { Tag } from '@dataesr/react-dsfr';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import grid from '../../../helpers/imports';
import ObjectService from '../../../services/Object.service';

const CardInfo = dynamic(() => import('./../../../components/CardInfo'));

export default function Web({}) {
    const { Col, Row, Container } = grid();

    const [weblinks, setWeblinks] = useState([]);

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

        if (!Object.keys(weblinks).length) {
            getData().then(({ data }) => {
                setWeblinks(data);
            });
        }
    });

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
