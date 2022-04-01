import { Checkbox, Col, Container, Row, TextInput } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { configValidators } from '../../config/objects';
import { AppContext } from '../../context/GlobalState';
import {
    cleanString,
    getFieldValue,
    getForm,
    getFormName,
    getSubObjectType,
    getUniqueId,
} from '../../helpers/utils';
import useValidator from '../../hooks/useValidator';
import DBService from '../../services/DB.service';
import ObjectService from '../../services/Object.service';
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
        ? configValidators[object][getSubObjectType(subObject)][validatorId]
        : null;
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, subObject, validatorId);
    const [textValue, setTextValue] = useState('');
    const currentForm = useCallback(
        () => (forms && formName ? getForm(forms, formName) : null),
        [formName, forms]
    );
    const [selectedValues, setSelectedvalues] = useState([]);

    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);

    const filterSearch = (internalValue, option) =>
        option.label.toLowerCase().includes(internalValue.toLowerCase());

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
        setFilteredOptions(
            options.filter((option, index, arr) =>
                filterSearch(textValue, option, index, arr)
            )
        );
    }, [options, textValue]);

    useEffect(() => {
        async function getData() {
            return await ObjectService.getAll(2);
        }

        if (validatorId === 'departments') {
            setOptions(
                departments.map((departement) => ({
                    value: departement.nom,
                    label: `${departement.codeRegion} - ${departement.nom}`,
                }))
            );
        } else if (options.length === 0) {
            getData().then(({ data }) => {
                setOptions(
                    data.map((resource) => ({
                        value: resource.id,
                        label: resource.id,
                    }))
                );
            });
        }
    }, [departments, options.length, validatorId]);

    useEffect(() => {
        if (uid && getForm(forms, formName)) {
            setSelectedvalues(getFieldValue(forms, formName, uid));
        }
    }, [currentForm, formName, forms, selectedValues, uid]);

    useEffect(() => {
        updateValidSection(uid, type);
    }, [type, uid, updateValidSection]);

    return (
        <section>
            <Container fluid>
                <Row>
                    <Col n="12">
                        <TextInput
                            message={message}
                            messageType={type}
                            onChange={(e) => setTextValue(e.target.value)}
                            value={textValue}
                            label={title}
                        />
                    </Col>
                    <Col n="8" spacing="py-1w">
                        <ul className="max-200">
                            {filteredOptions.map((option, i) => {
                                const { value, label } = option;

                                return (
                                    <li
                                        data-cy={`${cleanString(value)}-${i}`}
                                        key={value}
                                        className={styles.ListElement}
                                    >
                                        <Checkbox
                                            size="sm"
                                            label={label}
                                            onChange={onSelectChange}
                                            defaultChecked={
                                                selectedValues.indexOf(value) >
                                                -1
                                            }
                                            value={value}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </Col>
                    {selectedValues.length > 0 && (
                        <Col n="4" spacing="py-1w">
                            <ul>
                                {selectedValues.map((selected) => {
                                    return (
                                        <li key={uuidv4()} data-cy={selected}>
                                            {selected}
                                        </li>
                                    );
                                })}
                            </ul>
                        </Col>
                    )}
                </Row>
            </Container>
        </section>
    );
}

export default MultiSearch;
