import { Accordion, AccordionItem, Icon } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import useAccordions from '../../hooks/useAccordions';
import useCSSProperty from '../../hooks/useCSSProperty';
import styles from './Form.module.scss';

function AccordionForm({
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
        setSectionStatus(
            savingSections.indexOf(sectionId) < 0 ? 'valid' : 'warning'
        );
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

AccordionForm.default = {
    size: 'md',
    spacing: '',
    dataSection: '',
};
AccordionForm.propTypes = {
    size: PropTypes.string,
    sectionTitle: PropTypes.string.isRequired,
    sectionId: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
    dataSection: PropTypes.string,
    spacing: PropTypes.string,
};
export default AccordionForm;
