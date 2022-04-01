import { useRouter } from 'next/router';
import {
    cloneElement,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFieldValue, getFormName, getUniqueId } from '../../helpers/utils';
import styles from './FieldDependency.module.scss';

export function FieldDependency({ children, subObject, validatorId }) {
    const {
        stateForm: { forms, dependencies, validSections },
    } = useContext(AppContext);
    const [action, setAction] = useState('');
    const classAction = useMemo(() => {
        return {
            hidden: styles.IsHidden,
            disabled: styles.IsDisable,
        };
    }, []);

    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);

    const toDisable = (input, check) => {
        input.disabled = check || undefined;
        input.setAttribute('aria-disabled', check ? 'true' : 'false');
    };

    const toHidden = (input, check) => {
        input.setAttribute('aria-hidden', check ? 'true' : 'false');
    };

    const updateDOMFields = useCallback(() => {
        const inputs =
            document.querySelectorAll(
                `.${styles.IsHidden} input`,
                `.${styles.IsDisable} input`
            ) || [];

        Array.from(inputs).forEach((input) => {
            toDisable(input, getComputedStyle(input).pointerEvents === 'none');
            toHidden(input, getComputedStyle(input).display === 'none');
        });
    }, []);

    const updateAction = useMemo(() => {
        return {
            false: () => setAction(''),
            true: (action) => setAction(action),
        };
    }, []);

    useEffect(() => {
        const uidMinor = getUniqueId(formName, subObject, validatorId);
        const currentValidSection = validSections
            ? validSections[subObject]
            : null;
        const currentDependency = dependencies ? dependencies[uidMinor] : null;

        if (currentValidSection && currentDependency) {
            const { major, action } = currentDependency;

            if (currentDependency.rule === 'emptiness') {
                const majorValue = getFieldValue(forms, formName, major);

                updateAction[!majorValue](action);
            } else {
                // case rule is validator
                updateAction[currentValidSection[major] !== 'valid'](action);
            }
        }

        // wait for DOM to update before a11y udpdate
        setTimeout(() => {
            updateDOMFields();
        }, 0);
    }, [
        dependencies,
        formName,
        forms,
        subObject,
        updateAction,
        updateDOMFields,
        validSections,
        validatorId,
    ]);

    return cloneElement(children, {
        ...children.props,
        className: classAction[action],
    });
}
