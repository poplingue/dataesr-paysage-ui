import { Accordion, AccordionItem, Icon } from '@dataesr/react-dsfr';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { cleanString } from '../../helpers/utils';
import useAccordions from '../../hooks/useAccordions';
import useCSSProperty from '../../hooks/useCSSProperty';
import styles from './Form.module.scss';

// TODO add proptypes
export default function AccordionForm({
    size = 'lg',
    newTitle,
    children,
    dataSection,
    spacing,
}) {
    const { Col, Row, Container } = grid();

    const { style: green } = useCSSProperty('--success-main-525');
    const { style: grey } = useCSSProperty('--grey-850');
    const { style: dark } = useCSSProperty('--grey-50-1000');
    const { style: orange } = useCSSProperty('--warning-main-525');

    const [sectionStatus, setSectionStatus] = useState('neutral');
    const { expanded } = useAccordions(true);

    const {
        stateForm: { validSections },
    } = useContext(AppContext);

    useEffect(() => {
        const section = validSections[cleanString(newTitle)];

        if (section) {
            if (Object.keys(section).indexOf('saved') < 0) {
                setSectionStatus('neutral');
            } else {
                setSectionStatus(section.saved ? 'valid' : 'warning');
            }
        }
    }, [newTitle, validSections]);

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
                {newTitle}
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
                        data-cy="accordion"
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
