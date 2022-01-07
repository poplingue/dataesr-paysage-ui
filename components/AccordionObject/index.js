import {
    Accordion,
    AccordionItem,
    Col,
    Container,
    Row,
} from '@dataesr/react-dsfr';
import { cleanString, sectionUniqueId } from '../../helpers/utils';
import useAccordions from '../../hooks/useAccordions';

// TODO add proptypes
export default function AccordionObject({
    components,
    initExpand,
    color,
    skeleton,
}) {
    const { accordionClick } = useAccordions();

    return (
        <Container fluid>
            <Row>
                <Col spacing="mb-3w">
                    {skeleton.map((elm) => {
                        const { content, title, component, print } = elm;

                        const dataSection = sectionUniqueId(
                            cleanString(title),
                            content.length
                        );
                        const Component = components[component];

                        return (
                            <Accordion
                                className={!print ? 'no-print' : ''}
                                size="lg"
                                keepOpen
                                color={color}
                                key={title}
                            >
                                <AccordionItem
                                    onClick={() => accordionClick(dataSection)}
                                    initExpand={initExpand}
                                    keepOpen
                                    title={title}
                                    data-section={dataSection}
                                >
                                    {Component && (
                                        <Component
                                            section={dataSection}
                                            content={content}
                                        />
                                    )}
                                </AccordionItem>
                            </Accordion>
                        );
                    })}
                </Col>
            </Row>
        </Container>
    );
}
