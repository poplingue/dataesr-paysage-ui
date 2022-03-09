import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import grid from '../../helpers/imports';
import { externalAPI } from '../../services/ExternalAPI.service';
import Spinner from '../Spinner';
import styles from '../Suggest/Suggest.module.scss';

let timer;
let obj;

function Suggest({
    children,
    suggest,
    value,
    validatorId,
    onChange,
    subObject,
    focus,
}) {
    const [suggests, setSuggests] = useState([]);
    const [spinnerOn, setSpinner] = useState(false);
    const [stateValue, setStateValue] = useState(value);
    const { Col, Row } = grid();

    const onClick = (suggestion) => {
        onChange({ target: { value: suggestion.value } });
        setSuggests([]);
        setStateValue(suggestion.value);
    };

    const listRef = useRef();

    const reset = () => {
        if (obj) {
            obj.abort();
        }

        setSuggests([]);
        setSpinner(false);
    };

    useEffect(() => {
        if (listRef.current && !!suggests.length) {
            if (!focus && stateValue !== value) {
                // close suggestions list
                setSuggests([]);
            } else if (focus) {
                // focus to suggestions list
                listRef.current.focus();
            }
        }
    }, [focus, stateValue, suggests.length, value]);

    useEffect(() => {
        if (focus && stateValue !== value) {
            setSpinner(true);

            clearTimeout(timer);

            if (obj || value.length < 3 || !value) {
                reset();
            }

            if (value.length > 2) {
                setSpinner(true);

                timer = setTimeout(async () => {
                    obj = externalAPI.getPromiseWithAbort(
                        externalAPI.ods(value, validatorId)
                    );

                    obj.promise
                        .then((data) => {
                            // check input has focus
                            if (document.activeElement.value === value) {
                                setSuggests(data);
                            }
                        })
                        .finally(() => {
                            setSpinner(false);
                        });
                }, 600);

                setStateValue(value);
            }
        }
    }, [stateValue, spinnerOn, suggests.length, validatorId, value, focus]);

    const suggestionsList = () => {
        return (
            <Row alignItems="middle">
                <Col n={spinnerOn ? '10' : '12'} className="p-relative">
                    {children}
                    {!!suggests.length && (
                        <ul
                            ref={listRef}
                            onBlur={() => setSuggests([])}
                            className={styles.SuggestList}
                        >
                            {suggests.map((suggest, i) => {
                                return (
                                    <li key={suggest} tabIndex={i}>
                                        <div
                                            className={styles.SuggestItem}
                                            onClick={() => onClick(suggest)}
                                            tabIndex={i}
                                        >
                                            {suggest.label}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </Col>
                <Col n="2" spacing="px-1w">
                    <Spinner active={spinnerOn} small>
                        Chargement
                    </Spinner>
                </Col>
            </Row>
        );
    };

    const renderSuggest = {
        true: () => suggestionsList(),
        false: () => children,
    };

    return renderSuggest[suggest]();
}

Suggest.defaultProps = {
    suggest: false,
    focus: false,
    value: '',
};

Suggest.propTypes = {
    suggest: PropTypes.bool,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
    value: PropTypes.string,
    validatorId: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    subObject: PropTypes.string.isRequired,
    focus: PropTypes.bool,
};

export default Suggest;
