import {
    Accordion,
    AccordionItem,
    TextInput,
    Button,
    Select,
} from '@dataesr/react-dsfr';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import grid from '../../helpers/imports';
import CustomTagsInput from '../CustomTagsInput';
import validation from './validation';

export default function FormCategory({ categoryId }) {
    const { Col, Row, Container } = grid();
    const [data, setData] = useState({});
    const [modifiedFields, setModifiedFields] = useState([]);
    const [validationErrors, setValidationErrors] = useState([]);

    const [selected, setSelected] = useState('');
    const options = [
        // TODO : A récup de l'api
        { value: '', label: '- Select -', disabled: true, hidden: true },
        { value: '1', label: 'paysage' },
        { value: '2', label: 'wiki' },
        { value: '3', label: 'grid' },
        { value: '4', label: 'ror' },
    ];

    const [hasNewId, setHasNewId] = useState(false);
    const [newId, setsNewId] = useState({ type: '', value: '', active: true });

    // const [data, setData] = useState({});

    useEffect(() => {
        fetch(
            `https://api.paysage.staging.dataesr.ovh/categories/${categoryId}`
        )
            .then((response) => response.json())
            .then((data) => {
                setData(data);
            });
    }, [categoryId]);

    // useEffect(() => {
    //   if (initialData !== []) {
    //     setData(initialData);
    //   }
    // }, [initialData]);

    const onBaseInfoChangeHandler = ({ target: { name, value } }) => {
        const newData = { ...data };
        newData[name] = value;
        setData(newData);

        if (!modifiedFields.includes(name)) {
            const newModifiedFields = [...modifiedFields];
            newModifiedFields.push(name);
            setModifiedFields(newModifiedFields);
        }
    };

    const onSaveHandler = () => {
        const errors = validation(data);

        if (errors.length === 0) {
            console.log('update');
            const dataToSave = {};
            // Sauvegarde uniquement des champs modifiés
            modifiedFields.forEach((field) => {
                dataToSave[field] = data[field] || null;
            });

            let url = '/api/categories';
            let method = 'POST';

            if (data?.id) {
                url += '/' + data.id;
                method = 'PATCH';
            }

            axios({
                method,
                url,
                data: { data: dataToSave },
            })
                .then((response) => {
                    if (response.status === 200)
                        console.log(
                            'Save ok, redirection vers la page précédente'
                        );
                })
                .catch((err) => {
                    console.log('err', err);
                });
        } else {
            setValidationErrors(errors);
        }
    };

    const checkHint = (fieldName) => {
        if (modifiedFields.includes(fieldName)) return 'non sauvegardé';
    };

    const addIdentifier = () => {
        setHasNewId(true);
    };

    const saveIdentifier = () => {
        setHasNewId(true);
    };

    const cancelIdentifier = () => {
        setHasNewId(false);
    };

    return (
        <Container>
            <Row gutters spacing="px-2w">
                <Col n="12">
                    <Accordion>
                        <AccordionItem title="Noms de la catégorie">
                            <h2>Français</h2>
                            <TextInput
                                label="Nom usuel"
                                hint={checkHint('usualNameFr')}
                                value={data.usualNameFr}
                                name="usualNameFr"
                                onChange={onBaseInfoChangeHandler}
                            />
                            <TextInput
                                label="Nom court"
                                hint={checkHint('shortNameFr')}
                                value={data.shortNameFr}
                                name="shortNameFr"
                                onChange={onBaseInfoChangeHandler}
                            />
                            <TextInput
                                label="Nom au pluriel"
                                hint={checkHint('pluralNameFr')}
                                value={data.pluralNameFr}
                                name="pluralNameFr"
                                onChange={onBaseInfoChangeHandler}
                            />
                            <TextInput
                                label="Acronym"
                                hint={checkHint('acronymFr')}
                                value={data.acronymFr}
                                name="acronymFr"
                                onChange={onBaseInfoChangeHandler}
                            />
                            <TextInput
                                textarea
                                label="Description"
                                hint={checkHint('descriptionFr')}
                                value={data.descriptionFr}
                                name="descriptionFr"
                                onChange={onBaseInfoChangeHandler}
                            />
                            <CustomTagsInput
                                label="Autres noms"
                                name="otherNamesFr"
                                values={data.otherNamesFr || []}
                                onChange={(tags) => {
                                    setOtherNamesFr({
                                        name: 'otherNamesFr',
                                        value: tags,
                                    });
                                }}
                            />
                            {/* <CustomTagsInput label ="Autres noms" name="otherNamesFr" value={data.otherNamesFr || []} onChange={onBaseInfoChangeHandler} /> */}
                            <h2>Anglais</h2>
                            <TextInput
                                label="Nom usuel"
                                hint={checkHint('usualNameEn')}
                                value={data.usualNameEn}
                                name="usualNameEn"
                                onChange={onBaseInfoChangeHandler}
                            />
                            <TextInput
                                label="Nom court"
                                hint={checkHint('shortNameEn')}
                                value={data.shortNameEn}
                                name="shortNameEn"
                                onChange={onBaseInfoChangeHandler}
                            />
                            <TextInput
                                textarea
                                label="Description"
                                hint={checkHint('descriptionEn')}
                                value={data.descriptionEn}
                                name="descriptionEn"
                                onChange={onBaseInfoChangeHandler}
                            />

                            <ul className="errorMessages">
                                {validationErrors.map((err) => (
                                    <li key={err}>{err}</li>
                                ))}
                            </ul>

                            <Button
                                disabled={modifiedFields.length === 0}
                                onClick={onSaveHandler}
                            >
                                Sauvegarder
                            </Button>
                        </AccordionItem>
                        <AccordionItem title="Identifiants liés à la catégorie">
                            {!hasNewId ? (
                                <Button onClick={addIdentifier}>
                                    Ajouter un identifiant
                                </Button>
                            ) : (
                                <Container fluid>
                                    <Row>
                                        <Col>
                                            <Select
                                                label="Type"
                                                options={options}
                                                selected={selected}
                                                onChange={(e) =>
                                                    setSelected(e.target.value)
                                                }
                                            />
                                        </Col>
                                        <Col>
                                            <TextInput
                                                label="Valeur"
                                                value={data.usualNameEn}
                                                name="usualNameEn"
                                                onChange={
                                                    onBaseInfoChangeHandler
                                                }
                                            />
                                        </Col>
                                        <Col>switch actif/inactif</Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Button onClick={cancelIdentifier}>
                                                Annuler
                                            </Button>
                                        </Col>
                                        <Col>
                                            <Button onClick={saveIdentifier}>
                                                Sauvegarder cet identifiant
                                            </Button>
                                        </Col>
                                    </Row>
                                </Container>
                            )}
                        </AccordionItem>
                    </Accordion>
                </Col>
            </Row>
        </Container>
    );
}

FormCategory.propTypes = {
    // initialData: PropTypes.object,
    categoryId: PropTypes.string,
};

FormCategory.defaultProps = {
    categoryId: null,
};

// FormCategory.defaultProps = {
//   initialData: {
//     usualNameFr: '',
//     shortNameFr: '',
//     acronymFr: '',
//     pluralNameFr: '',
//     otherNamesFr: [],
//     descriptionFr: '',
//     usualNameEn: '',
//     shortNameEn: '',
//     otherNamesEn: [],
//     descriptionEn: ''
//   },
// };
