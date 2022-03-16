import { useContext, useEffect, useState } from 'react';
import FieldButton from '../components/FieldButton';
import { AppContext } from '../context/GlobalState';

const useAccordions = (init = false) => {
    const [expanded, setExpanded] = useState(init);
    const [list, setList] = useState([]);

    const { dispatchPage: dispatch } = useContext(AppContext);

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

        setExpanded(!expanded);
    };

    const expandCloseAll = () => {
        const open = expanded ? 'true' : 'false';
        const btnAccordions = document.querySelectorAll(
            `.fr-accordion__btn[aria-expanded="${open}"]`
        );

        for (let i = 0; i < btnAccordions.length; i = i + 1) {
            simulateClick(btnAccordions[i]);
        }
    };

    const accordionClick = (section) => {
        const newList = [...list];

        dispatch({ type: 'UPDATE_ACCORDION_ITEMS', payload: newList });

        for (let i = 0; i < newList.length; i++) {
            const currentList = newList[i];

            if (currentList.section === section) {
                currentList.expanded = !currentList.expanded;

                return;
            }
        }
    };

    const Button = (
        <FieldButton
            dataTestId="btn-expand-close"
            title="Réduire / Ouvrir les sections"
            onClick={expandCloseAll}
        />
    );

    useEffect(() => {
        const l = [];

        if (!list.length) {
            const elms = document.querySelectorAll('.fr-accordions-group > li');

            for (let i = 0; i < elms.length; i++) {
                const expanded = elms[i].querySelector('button').ariaExpanded;
                const section = elms[i].dataset.section;
                l.push({ expanded: expanded !== 'false', section });
            }

            setList(l);

            // init Global state
            dispatch({ type: 'UPDATE_ACCORDION_ITEMS', payload: l });
        }
    }, [dispatch, list]);

    return { expanded, Button, closeAll, expandAll, accordionClick, list };
};

export default useAccordions;
