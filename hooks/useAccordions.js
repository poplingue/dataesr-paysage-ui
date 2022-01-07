import { useState } from 'react';
import FieldButton from '../components/FieldButton';
import useCSSProperty from './useCSSProperty';

const useAccordions = (init) => {
    const [accordionsExpanded, setAccordionsExpanded] = useState(init);

    const actionAll = (expand) => {
        const btnAccordions = document.querySelectorAll(
            `.fr-accordion__btn[aria-expanded=${expand}]`
        );

        for (let i = 0; i < btnAccordions.length; i = i + 1) {
            simulateClick(btnAccordions[i]);
        }
    };

    const closeAll = () => {
        actionAll('true');
    };

    const expandAll = () => {
        actionAll('false');
    };

    const simulateClick = (elem) => {
        const evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        // If cancelled, don't dispatch our event
        const canceled = !elem.dispatchEvent(evt);

        setAccordionsExpanded(!accordionsExpanded);
    };

    const expandCloseAll = () => {
        const open = accordionsExpanded ? 'true' : 'false';
        const btnAccordions = document.querySelectorAll(
            `.fr-accordion__btn[aria-expanded="${open}"]`
        );

        for (let i = 0; i < btnAccordions.length; i = i + 1) {
            simulateClick(btnAccordions[i]);
        }
    };

    const { style: pink } = useCSSProperty('--pink-tuile-main-556');
    const { style: white } = useCSSProperty('--grey-1000');

    const Button = (
        <FieldButton
            colors={[pink, white]}
            dataTestId="btn-expand-close"
            title="Réduire / Ouvrir"
            onClick={expandCloseAll}
        />
    );

    return { accordionsExpanded, Button, closeAll, expandAll };
};

export default useAccordions;
