import { Title } from '@dataesr/react-dsfr';
import grid from '../../../helpers/imports';

import { sectionUniqueId } from '../../../helpers/utils';

import PresHeader from './Header';
import History from './History';
import IdentifiersWrapper from './IdentifiersWrapper';

const components = {
    header: PresHeader,
    history: History,
    identifiersWrapper: IdentifiersWrapper,
};

export default function Presentation({ content, section }) {
    const { Col, Row, Container } = grid();

    return (
        <>
            {content.map((subSection) => {
                const { title, component } = subSection;
                const dataSubSection = sectionUniqueId(title);
                const Component = components[component];

                return (
                    <div key={title} data-section={dataSubSection}>
                        <Container fluid>
                            <Row spacing="px-2w">
                                {title && (
                                    <Col>
                                        <Title as="h3" look="h6">
                                            {title}
                                        </Title>
                                    </Col>
                                )}
                            </Row>
                            <Row>
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
