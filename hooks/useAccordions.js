import { useContext, useEffect, useState } from 'react';
import FieldButton from '../components/FieldButton';
import { AppContext } from '../context/GlobalState';
import useCSSProperty from './useCSSProperty';

const useAccordions = (init = false) => {
    const [expanded, setExpanded] = useState(init);
    const [list, setList] = useState([]);

    const { style: pink } = useCSSProperty('--pink-tuile-main-556');
    const { style: white } = useCSSProperty('--grey-1000');

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

        for (let i = 0; i < newList.length; i++) {
            if (newList[i].section === section) {
                newList[i].expanded = !newList[i].expanded;
                setList(newList);

                return;
            }
        }
    };

    const Button = (
        <FieldButton
            colors={[pink, white]}
            dataTestId="btn-expand-close"
            title="Réduire / Ouvrir"
            onClick={expandCloseAll}
        />
    );

    useEffect(() => {
        dispatch({
            type: 'UPDATE_ACCORDION_SECTIONS',
            payload: list,
        });
    }, [dispatch, list]);

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
        }
    }, [list]);

    return { expanded, Button, closeAll, expandAll, accordionClick };
};

export default useAccordions;
