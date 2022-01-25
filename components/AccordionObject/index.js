import { Accordion, AccordionItem } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import {
    PersonPageSkeletonPropType,
    StructurePageSkeletonPropType,
} from '../../helpers/constants';
import grid from '../../helpers/imports';
import { sectionUniqueId } from '../../helpers/utils';
import useAccordions from '../../hooks/useAccordions';

// TODO add proptypes
export default function AccordionObject({
    components,
    initExpand,
    color,
    skeleton,
}) {
    const { accordionClick } = useAccordions();
    const { Col, Row, Container } = grid();

    return (
        <Container fluid>
            <Row>
                <Col spacing="mb-3w">
                    {skeleton.map((elm) => {
                        const { content, title, component, print } = elm;

                        const dataSection = sectionUniqueId(
                            title,
                            content.length
                        );
                        const Component = components[component];

                        return (
                            Component && (
                                <Accordion
                                    className={!print ? 'no-print' : ''}
                                    size="lg"
                                    keepOpen
                                    color={color}
                                    key={title}
                                >
                                    <AccordionItem
                                        onClick={() =>
                                            accordionClick(dataSection)
                                        }
                                        initExpand={initExpand}
                                        keepOpen
                                        title={title}
                                        data-section={dataSection}
                                    >
                                        <Component
                                            section={dataSection}
                                            content={content}
                                        />
                                    </AccordionItem>
                                </Accordion>
                            )
                        );
                    })}
                </Col>
            </Row>
        </Container>
    );
}

AccordionObject.defaultPorps = {
    color: '',
    initExpand: false,
};

AccordionObject.propTypes = {
    components: PropTypes.oneOfType([
        PersonPageSkeletonPropType,
        StructurePageSkeletonPropType,
    ]).isRequired,
    initExpand: PropTypes.bool,
    color: PropTypes.string,
    skeleton: PropTypes.arrayOf(
        PropTypes.shape({
            content: PropTypes.arrayOf(
                PropTypes.shape({
                    title: PropTypes.string,
                    type: PropTypes.string,
                    validatorId: PropTypes.string,
                })
            ).isRequired,
            print: PropTypes.bool,
            component: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        })
    ).isRequired,
};
