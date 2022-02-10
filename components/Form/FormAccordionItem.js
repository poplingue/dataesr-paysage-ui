import { useRouter } from 'next/router';
import { useCallback, useContext, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { cleanString, getFormName, getSection } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import FieldButton from '../FieldButton';
import DeleteButton from '../InfiniteAccordion/DeleteButton';
import SwitchField from '../SwitchField';

const notif = {
    valid: { msg: 'Données sauvegardées' },
    error: {
        msg: 'Erreur : tous les champs ne sont pas valides',
        type: 'error',
    },
};

export default function FormAccordionItem({
    content,
    newTitle,
    title,
    deletable = false,
    index,
    subObject,
    deleteSection,
}) {
    const { Col, Row, Container } = grid();
    const {
        stateForm: {
            validSections,
            updateObjectId,
            savingSections,
            storeObjects,
        },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);

    const { style: green } = useCSSProperty('--success-main-525');
    const { style: white } = useCSSProperty('--grey-1000');
    const { style: orange } = useCSSProperty('--warning-main-525');
    const [disabled, setDisabled] = useState(true);

    const updateValidSection = useCallback(
        (id, validType) => {
            const title = cleanString(newTitle);
            const section = validSections[title];
            let payload = null;

            if (savingSections.indexOf(subObject) > -1) {
                setDisabled(false);
            }

            if (!id && !validType && disabled) {
                setDisabled(false);
                payload = {
                    [title]: {
                        ...section,
                        ...{ saved: false },
                    },
                };
            }

            if (id && (!section || (section && section[id] !== validType))) {
                payload = {
                    [title]: {
                        ...section,
                        ...{ [id]: validType },
                    },
                };
            }

            if (payload) {
                dispatch({
                    type: 'UPDATE_VALID_SECTION',
                    payload: { section: payload },
                });
            }
        },
        [newTitle, validSections, savingSections, subObject, disabled, dispatch]
    );

    const save = async () => {
        const title = cleanString(newTitle);
        const currentSection = validSections[title];

        if (validSections && currentSection) {
            const valid = Object.values(currentSection).indexOf('error') < 0;

            const payload = {
                section: {
                    [title]: {
                        ...currentSection,
                        ...{ saved: valid },
                    },
                },
            };

            dispatch({
                type: 'UPDATE_VALID_SECTION',
                payload,
            });

            // Save data
            // TODO add objecStoreCheck
            // TODO instead DBservice use form props??
            const form = await DBService.getAllObjects(formName, true);

            const filteredForm = form
                .filter((field) =>
                    dataFormService.bySubObject(field, subObject)
                )
                .filter(dataFormService.byInfiniteFamily);

            const cleanedForm = filteredForm
                .filter(dataFormService.checkDateField)
                .map(dataFormService.cleanDateFormat);

            dataFormService
                .save(cleanedForm, updateObjectId, subObject)
                .then(async () => {
                    fieldsToSaved(filteredForm);
                })
                .catch((err) => {
                    NotifService.info(err, 'error');
                });
        }
    };

    const fieldsToSaved = (form) => {
        for (let i = 0; i < form.length; i = i + 1) {
            const { uid, value } = form[i];

            dispatch({
                type: 'UPDATE_FORM_FIELD',
                payload: {
                    value,
                    uid,
                    formName,
                    unSaved: false,
                },
            });

            DBService.set(
                {
                    ...form[i],
                    unSaved: false,
                },
                formName
            ).then(() => {
                resetDisabled(uid);
                NotifService.info('Données sauvegardées', 'valid');
            });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        save();
    };

    /**
     * Filter fields by subObject (names, identifiers...)
     * @param fields
     * @returns {*}
     */
    const filterSection = (fields) =>
        fields.filter((field) => field.uid.indexOf(subObject) > -1);

    /**
     * Delete all fields unSaved in indexDB and state and rollback to init Section fields
     * @returns {Promise<void>}
     */
    const resetSection = async () => {
        const form = await DBService.getAllObjects(formName, true);

        const uids = form.flatMap((f) => {
            const { uid, unSaved } = f;

            return uid.indexOf(subObject) > -1 && unSaved ? uid : [];
        });

        dispatch({
            type: 'DELETE_FORM_FIELD_LIST',
            payload: {
                uids,
                formName,
            },
        });

        await DBService.deleteList(uids, formName);

        dataFormService
            .initFormSections(
                object,
                updateObjectId,
                formName,
                storeObjects,
                filterSection
            )
            .then((fields) => {
                dispatch({
                    type: 'UPDATE_FORM_FIELD_LIST',
                    payload: {
                        formName,
                        fields,
                    },
                });
            });

        resetDisabled(uids[0]);
    };

    const resetDisabled = (uid) => {
        const section = getSection(uid);

        dispatch({
            type: 'DELETE_SAVING_SECTION',
            payload: { section },
        });

        setDisabled(true);
    };

    return (
        <form onSubmit={onSubmit}>
            {content.map((field) => {
                const {
                    type: fieldType,
                    infinite,
                    staticValues,
                    validatorId,
                    title,
                    value,
                } = field;

                const fieldTitle = title;

                return (
                    <div key={fieldTitle}>
                        <Container>
                            <Row alignItems="middle" gutters>
                                <Col spacing="py-2w">
                                    <SwitchField
                                        updateValidSection={updateValidSection}
                                        validatorId={validatorId}
                                        subObject={subObject}
                                        value={value}
                                        section={newTitle}
                                        type={fieldType}
                                        title={fieldTitle}
                                        infinite={infinite}
                                        staticValues={staticValues}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    </div>
                );
            })}
            <Row>
                <Container>
                    <Row gutters justifyContent="right" spacing="pt-2w">
                        <DeleteButton
                            display={deletable}
                            title={title}
                            index={index}
                            onClick={async () =>
                                await deleteSection(
                                    cleanString(subObject.slice(0, -2)),
                                    index,
                                    newTitle
                                )
                            }
                        />
                        {/* TODO remove data-testId */}
                        <Col n="2" className="txt-right">
                            <FieldButton
                                onClick={() => resetSection(subObject)}
                                disabled={disabled}
                                colors={disabled ? [] : [white, orange]}
                                title="Annuler"
                                dataTestId={`${cleanString(
                                    newTitle
                                )}-resetSection-button`}
                            />
                        </Col>
                        <Col n="2" className="txt-right">
                            <FieldButton
                                submit
                                disabled={disabled}
                                colors={disabled ? [] : [white, green]}
                                title="Sauvegarder"
                                dataTestId={`${cleanString(
                                    newTitle
                                )}-save-button`}
                            />
                        </Col>
                    </Row>
                </Container>
            </Row>
        </form>
    );
}
