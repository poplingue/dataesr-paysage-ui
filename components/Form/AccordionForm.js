import { Accordion, AccordionItem, Icon } from '@dataesr/react-dsfr';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import useAccordions from '../../hooks/useAccordions';
import useCSSProperty from '../../hooks/useCSSProperty';
import styles from './Form.module.scss';

// TODO add proptypes
export default function AccordionForm({
    size = 'md',
    sectionTitle,
    sectionId,
    children,
    dataSection,
    spacing,
}) {
    const { Col, Row, Container } = grid();

    const { style: green } = useCSSProperty('--success-main-525');
    const { style: grey } = useCSSProperty('--grey-850');
    const { style: dark } = useCSSProperty('--grey-50-1000');
    const { style: orange } = useCSSProperty('--text-default-warning');

    const [sectionStatus, setSectionStatus] = useState('neutral');
    const { expanded } = useAccordions(true);

    const {
        stateForm: { validSections, savingSections },
    } = useContext(AppContext);

    useEffect(() => {
        const section = validSections[sectionId];

        if (section) {
            setSectionStatus(section.saved ? 'valid' : 'warning');
        }
    }, [savingSections, sectionId, validSections]);

    const renderTitle = () => {
        const colorIcon = {
            warning: orange,
            valid: green,
            neutral: grey,
        };

        return (
            <Icon
                className={`cy-${sectionStatus}`}
                color={colorIcon[sectionStatus]}
                size="1x"
                name="ri-shield-check-line"
            >
                {sectionTitle}
            </Icon>
        );
    };

    return (
        <Container fluid>
            <Row>
                <Col spacing={spacing || 'mb-3w'}>
                    <Accordion
                        className={styles.Accordion}
                        color={dark}
                        keepOpen
                        size={size}
                        data-section={dataSection}
                    >
                        <AccordionItem
                            initExpand={expanded}
                            className={styles.Item}
                            title={renderTitle()}
                        >
                            {children}
                        </AccordionItem>
                    </Accordion>
                </Col>
            </Row>
        </Container>
    );
}
