import { Title } from '@dataesr/react-dsfr';
import dsfrGrid from '../../../helpers/imports';
import { sectionUniqueId } from '../../../helpers/utils';
import Contact from './Contact';
import Functions from './Functions';
import News from './News';

const components = {
    functions: Functions,
    contact: Contact,
    news: News,
};

export default function Synthesis({ content }) {
    const { Col, Row, Container } = dsfrGrid();

    // TODO wrapper dynamic component
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
                                    {Component && <Component />}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                );
            })}
        </>
    );
}
