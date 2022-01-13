import { Title } from '@dataesr/react-dsfr';
import grid from '../../../helpers/imports';
import { sectionUniqueId } from '../../../helpers/utils';
import Map from '../../MapComponent';
import History from './History';

const components = {
    history: History,
};

export default function Presentation({ content, section, expand }) {
    const { Col, Row, Container } = grid();

    return (
        <>
            {content.map((subSection, index) => {
                const { title, component } = subSection;
                const dataSubSection = sectionUniqueId(title);
                const Component = components[component];

                return (
                    <div key={title} data-section={dataSubSection}>
                        <Container fluid>
                            {index === 0 ? (
                                <Row spacing="px-2w">
                                    <Col spacing="pb-8w">
                                        <Map />
                                    </Col>
                                </Row>
                            ) : null}
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
                                        <Component section={section} />
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
