import { useRouter } from 'next/router';
import { cloneElement, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFormName, getUniqueId } from '../../helpers/utils';
import styles from './FieldDependency.module.scss';

export function FieldDependency({ children, subObject, validatorId }) {
    const {
        stateForm: { dependencies, validSections },
    } = useContext(AppContext);
    const [action, setAction] = useState('');
    const objClass = {
        hidden: styles.IsHidden,
        disabled: styles.IsDisable,
    };

    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);

    useEffect(() => {
        const uid = getUniqueId(formName, subObject, validatorId);
        const currentValidSection = validSections
            ? validSections[subObject]
            : null;
        const currentDependency = dependencies ? dependencies[uid] : null;

        if (currentValidSection && currentDependency) {
            setAction(
                currentValidSection[currentDependency.major] !== 'valid'
                    ? currentDependency.action
                    : ''
            );
        }
    }, [dependencies, formName, action, subObject, validSections, validatorId]);

    return cloneElement(children, {
        ...children.props,
        className: objClass[action],
    });
}
