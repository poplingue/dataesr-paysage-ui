import { Checkbox, Col, Container, Row, TextInput } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../../context/GlobalState';
import { configValidators } from '../../helpers/constants';
import {
    cleanString,
    getFieldValue,
    getForm,
    getFormName,
    getUniqueId,
} from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';
import styles from './MultiSearch.module.scss';

function MultiSearch({ title, subObject, updateValidSection, validatorId }) {
    const {
        stateForm: { departments, forms, storeObjects },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const validatorConfig = object
        ? configValidators[object][validatorId]
        : null;
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, title);
    const [textValue, setTextValue] = useState('');
    const currentForm = useCallback(
        () => (forms && formName ? getForm(forms, formName) : null),
        [formName, forms]
    );
    const [selectedValues, setSelectedvalues] = useState([]);
    const options = departments.map((departement) => ({
        value: departement.nom,
        label: `${departement.codeRegion} - ${departement.nom}`,
    }));
    const filterSearch = (internalValue, option) =>
        option.label.toLowerCase().includes(internalValue.toLowerCase());
    const filteredOptions = options.filter((option, index, arr) =>
        filterSearch(textValue, option, index, arr)
    );
    const { checkField, message, type } = useValidator(validatorConfig);

    const onSelectChange = async (e) => {
        const { value } = e.target;
        const checkStoreObject = storeObjects.indexOf(formName) > -1;

        // Remove value if exists
        let newValue =
            selectedValues && selectedValues.filter((item) => item !== value);

        // Add value if does not exist
        if (selectedValues.indexOf(value) === -1) {
            newValue = [...selectedValues, value];
        }

        dispatch({
            type: 'UPDATE_FORM_FIELD',
            payload: {
                value: newValue,
                uid,
                formName,
            },
        });

        if (checkStoreObject) {
            await DBService.set(
                {
                    value: newValue,
                    uid,
                },
                formName
            );
        }

        checkField({ value: newValue.join(' ') });
        updateValidSection(null, null);
    };

    useEffect(() => {
        if (uid && getForm(forms, formName)) {
            setSelectedvalues(getFieldValue(forms, formName, uid));
        }
    }, [currentForm, formName, forms, selectedValues, uid]);

    useEffect(() => {
        updateValidSection(uid, type);
    }, [type, uid, updateValidSection]);

    return (
        <section className="wrapper-multi-search">
            <TextInput
                message={message}
                messageType={type}
                onChange={(e) => setTextValue(e.target.value)}
                value={textValue}
                label={title}
            />
            <Container fluid>
                <Row gutters>
                    <Col n="6" spacing="py-1w">
                        <ul className="max-200">
                            {filteredOptions.map((option, i) => {
                                return (
                                    <li
                                        data-cy={`${cleanString(
                                            option.value
                                        )}-${i}`}
                                        key={uuidv4()}
                                        className={styles.listElement}
                                    >
                                        <Checkbox
                                            label={option.label}
                                            onChange={(e) => {
                                                onSelectChange(e);
                                            }}
                                            defaultChecked={
                                                selectedValues.indexOf(
                                                    option.value
                                                ) > -1
                                            }
                                            value={option.value}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </Col>
                    <Col n="6" spacing="py-1w">
                        {selectedValues.length > 0 && (
                            <ul>
                                {selectedValues.map((selected) => {
                                    return (
                                        <li key={uuidv4()} data-cy={selected}>
                                            {selected}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default MultiSearch;
