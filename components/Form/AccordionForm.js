import { Accordion, AccordionItem, Icon } from '@dataesr/react-dsfr';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { cleanString } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import styles from '../InfiniteAccordion/InfiniteAcordion.module.scss';

// TODO add proptypes
export default function AccordionForm({
    color,
    size = 'lg',
    initExpand,
    newTitle,
    children,
    dataSection,
}) {
    const { style: green } = useCSSProperty('--success');
    const { style: grey } = useCSSProperty('--g-400');
    const { style: orange } = useCSSProperty('--warning');

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
                name="ri-check-double-line"
                iconPosition="right"
            >
                <span>{newTitle}</span>
            </Icon>
        );
    };

    return (
        <Accordion
            color={color}
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
    );
}
