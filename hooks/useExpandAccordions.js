import { useState } from 'react';
import FieldButton from '../components/FieldButton';

const useExpandAccordions = (init) => {
    const [accordionsExpanded, setAccordionsExpanded] = useState(init);

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

    const Button = (
        <FieldButton
            dataTestId="btn-expand-close"
            title="Réduire / Ouvrir"
            onClick={expandCloseAll}
        />
    );

    return { accordionsExpanded, Button };
};

export default useExpandAccordions;
