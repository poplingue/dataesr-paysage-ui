import { useRouter } from 'next/router';
import { cloneElement, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFormName, getUniqueId } from '../../helpers/utils';
import styles from './FieldDependency.module.scss';

export function FieldDependency({ children, subObject, validatorId }) {
    const {
        stateForm: { dependencies, validSections },
    } = useContext(AppContext);
    const [propAction, setPropAction] = useState('');
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
        const currentValidSection = validSections[subObject];
        const currentDependency =
            dependencies[getUniqueId(formName, subObject, validatorId)];

        if (currentValidSection && currentDependency) {
            setPropAction(
                currentValidSection[currentDependency.major] !== 'valid'
                    ? currentDependency.action
                    : ''
            );
        }
    }, [
        dependencies,
        formName,
        propAction,
        subObject,
        validSections,
        validatorId,
    ]);

    return cloneElement(children, {
        ...children.props,
        className: objClass[propAction],
    });
}
