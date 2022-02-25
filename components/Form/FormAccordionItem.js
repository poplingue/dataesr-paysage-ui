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

export default function FormAccordionItem({
    content,
    newTitle,
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
    const { style: orange } = useCSSProperty('--text-default-warning');
    const [disabled, setDisabled] = useState(true);

    const updateValidSection = useCallback(
        (id, validType) => {
            const title = cleanString(newTitle);
            const validSection = validSections[title];
            let section = null;
            const currentSection = getSection(id);

            if (
                (!id && !validType && disabled) ||
                (savingSections.indexOf(currentSection) > -1 && disabled)
            ) {
                setDisabled(false);

                section = {
                    [title]: {
                        ...validSection,
                        ...{ saved: false },
                    },
                };
            }

            if (
                id &&
                (!validSection ||
                    (validSection && validSection[id] !== validType))
            ) {
                section = {
                    [title]: {
                        ...validSection,
                        ...{ [id]: validType, saved: disabled },
                    },
                };
            }

            if (section) {
                dispatch({
                    type: 'UPDATE_VALID_SECTION',
                    payload: { section },
                });
            }
        },
        [newTitle, validSections, savingSections, disabled, dispatch]
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

            return dataFormService
                .save(cleanedForm, updateObjectId, subObject)
                .then(async () => {
                    return fieldsToSaved(filteredForm);
                })
                .catch((err) => {
                    return Promise.reject(err);
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
            });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();

        save()
            .then(() => {
                NotifService.info('Données sauvegardées', 'valid');
            })
            .catch((err) => {
                NotifService.info(err, 'error');
            });
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
        const title = cleanString(newTitle);
        const validSection = validSections[title];
        const section = {
            [title]: {
                ...validSection,
                ...{ saved: true },
            },
        };
        const form = await DBService.getAllObjects(formName, true);
        const uids = form.flatMap((f) => {
            const { uid, unSaved } = f;

            return uid.indexOf(subObject) > -1 && unSaved ? uid : [];
        });

        // TODO refacto
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

        dispatch({
            type: 'UPDATE_VALID_SECTION',
            payload: { section },
        });
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
                            title={newTitle}
                            onClick={async () =>
                                await deleteSection(subObject, index, newTitle)
                            }
                        />
                        {/* TODO remove data-testId */}
                        <Col n="6 lg-2" className="txt-right">
                            <FieldButton
                                onClick={resetSection}
                                disabled={disabled}
                                colors={disabled ? [] : [white, orange]}
                                title="Annuler"
                                dataTestId={`${cleanString(
                                    newTitle
                                )}-resetSection-button`}
                            />
                        </Col>
                        <Col n="6 lg-2" className="txt-right">
                            <FieldButton
                                submit
                                disabled={disabled}
                                colors={disabled ? [] : [white, green]}
                                title="Sauvegarder"
                                dataTestId={`${newTitle}-save-button`}
                            />
                        </Col>
                    </Row>
                </Container>
            </Row>
        </form>
    );
}
