import { Title } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import grid from '../../../helpers/imports';
import { sectionUniqueId } from '../../../helpers/utils';
import useWorkerObject from '../../../hooks/useWorkerObject';
import Contact from './Contact';
import Functions from './Functions';
import News from './News';

const components = {
    contact: Contact,
    functions: Functions,
    news: News,
};

export default function Synthesis({ content }) {
    const { Col, Row, Container } = grid();

    const {
        query: { id, type },
    } = useRouter();

    const { fetchObject, objectData } = useWorkerObject();

    useEffect(() => {
        async function fetchPerson() {
            fetchObject(type, id);
        }

        if (id) {
            fetchPerson();
        }
    }, [fetchObject, id, type]);

    return (
        <>
            {content.map((subSection) => {
                const { title, component } = subSection;
                const dataSection = sectionUniqueId(title);
                const Component = components[component];

                return (
                    <div key={title} data-section={dataSection}>
                        <Container fluid>
                            <Row spacing="px-2w">
                                <Col>
                                    <Title as="h3" look="h6">
                                        {title}
                                    </Title>
                                </Col>
                            </Row>
                            <Row spacing="px-2w">
                                <Col spacing="pb-8w">
                                    {Component && (
                                        <Component data={objectData} />
                                    )}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                );
            })}
        </>
    );
}
