import {
    Accordion,
    AccordionItem,
    Col,
    Container,
    Icon,
    Row,
} from '@dataesr/react-dsfr';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { cleanString } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import styles from './Form.module.scss';

// TODO add proptypes
export default function AccordionForm({
    size = 'lg',
    initExpand,
    newTitle,
    children,
    dataSection,
    spacing,
}) {
    const { style: green } = useCSSProperty('--success-main-525');
    const { style: grey } = useCSSProperty('--grey-850');
    const { style: dark } = useCSSProperty('--grey-425');
    const { style: orange } = useCSSProperty('--warning-main-525');

    const [sectionStatus, setSectionStatus] = useState('neutral');

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
                verticalAlign
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
                            initExpand={initExpand}
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
