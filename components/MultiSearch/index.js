import { Checkbox, Col, Container, Row, TextInput } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from '../../context/GlobalState';
import { cleanString, getFieldValue, getForm, getFormName, getUniqueId } from '../../helpers/utils';
import DBService from '../../services/DBService';
import styles from './MultiSearch.module.scss';

function MultiSearch({ title, parentsection }) {
    const { state: { departments, forms, storeObjects }, dispatch } = useContext(AppContext);
    const { pathname, query: { object } } = useRouter();
    const formName = getFormName(pathname, object);
    const uid = getUniqueId(formName, parentsection, title, 0);
    const [textValue, setTextValue] = useState('');
    const currentForm = useCallback(() => forms && formName ? getForm(forms, formName) : null, [forms, pathname]);
    const [selectedValues, setSelectedvalues] = useState([]);
    const options = departments.map((departement) => ({
        value: departement.nom,
        label: `${departement.codeRegion} - ${departement.nom}`
    }));
    const filterSearch = (
        internalValue,
        option,
    ) => option.label.toLowerCase().includes(internalValue.toLowerCase());
    const filteredOptions = options.filter((option, index, arr) => filterSearch(textValue, option, index, arr));

    const onSelectChange = async (e) => {
        const { value } = e.target;
        const checkStoreObject = storeObjects.indexOf(formName) > -1;

        // Remove value if exists
        let newValue = selectedValues && selectedValues.filter((item) => item !== value);

        // Add value is does not exist
        if (selectedValues.indexOf(value) === -1) {
            newValue = [...selectedValues, value];
        }

        dispatch({
            type: 'UPDATE_FORM_FIELD',
            payload: {
                value: newValue,
                uid,
                formName,
            }
        });

        if (checkStoreObject) {
            await DBService.set({
                value: newValue,
                uid
            }, formName);
        }
    };

    useEffect(() => {
        if (uid && getForm(forms, formName)) {
            setSelectedvalues(getFieldValue(forms, formName, uid));
        }
    }, [currentForm, formName, forms, selectedValues, uid]);

    return (
        <section className="wrapper-multi-search py-10">
            <TextInput
                onChange={(e) => setTextValue(e.target.value)}
                value={textValue}
                label={title}
            />
            <Container>
                <Row>
                    <Col n="6">
                        <ul className="max-200">
                            {filteredOptions.map((option, i) => {
                                return <li
                                    data-cy={`${cleanString(option.value)}-${i}`}
                                    key={uuidv4()} className={`${styles.listElement} py-10`}>
                                    <Checkbox
                                        label={option.label}
                                        onChange={(e) => {
                                            onSelectChange(e);
                                        }}
                                        defaultChecked={selectedValues.indexOf(option.value) > -1}
                                        value={option.value}
                                    />
                                </li>;
                            })}
                        </ul>
                    </Col>
                    <Col n="6">
                        {selectedValues.length > 0 && (<ul>
                            {selectedValues.map((selected) => {
                                return <li key={uuidv4()}>{selected}</li>;
                            })}
                        </ul>)}
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default MultiSearch;
