import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { getFormName, getUniqueId } from '../../helpers/utils';
import DBService from '../../services/DB.service';
import { externalAPI } from '../../services/ExternalAPI.service';
import Spinner from '../Spinner';
import styles from '../Suggest/Suggest.module.scss';

let timer;
let wrapPromise;

function Suggest({
    children,
    suggest,
    value,
    validatorId,
    onChange,
    subObject,
    focus,
}) {
    const { Col, Row } = grid();

    const [suggests, setSuggests] = useState([]);
    const [spinnerOn, setSpinner] = useState(false);
    const [stateValue, setStateValue] = useState(value);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const { dispatchForm: dispatch } = useContext(AppContext);
    const formName = getFormName(pathname, object);

    const onClick = async ({ updates, suggestion }) => {
        // mock input onChange event
        onChange({ target: { value: suggestion.value } });

        setSuggests([]);
        setStateValue(suggestion.value);

        const fields = updates.map((field) => {
            const { validatorId, value } = field;

            return {
                uid: getUniqueId(formName, subObject, validatorId),
                value,
                unSaved: true,
            };
        });

        // update global state
        dispatch({
            type: 'UPDATE_FORM_FIELD_LIST',
            payload: {
                formName,
                fields,
            },
        });

        // update indexDB
        await DBService.setList(fields, formName);
    };

    const reset = () => {
        if (wrapPromise) {
            wrapPromise.abort();
        }

        setSuggests([]);
        setSpinner(false);
    };

    useEffect(() => {
        // case onClick on SuggestItem
        if (
            !focus &&
            (stateValue !== value ||
                document.activeElement.className !== styles.SuggestItem)
        ) {
            reset();
        }
    }, [focus, stateValue, value]);

    useEffect(() => {
        if (focus && stateValue !== value) {
            setSpinner(true);

            clearTimeout(timer);

            if (wrapPromise || value.length < 3 || !value) {
                reset();
            }

            if (value.length > 2) {
                setSpinner(true);

                timer = setTimeout(async () => {
                    wrapPromise = externalAPI.getPromiseWithAbort(
                        externalAPI.openDataSoft(value, validatorId)
                    );

                    wrapPromise.promise
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
                            data-cy="suggestions"
                            onBlur={() => setSuggests([])}
                            className={styles.SuggestList}
                        >
                            {suggests.map((suggest, i) => {
                                return (
                                    <li key={suggest.suggestion.value}>
                                        <div
                                            className={styles.SuggestItem}
                                            onClick={() => onClick(suggest)}
                                            tabIndex={i}
                                        >
                                            {suggest.suggestion.label}
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
