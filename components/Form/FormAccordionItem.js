import { useRouter } from 'next/router';
import { useCallback, useContext, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { connexionNeeded, invalidToken } from '../../helpers/internalMessages';
import { checkFlatMap, getFormName, getSection } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import FieldButton from '../FieldButton';
import DeleteButton from '../InfiniteAccordion/DeleteButton';
import WrapperFieldType from '../WrapperFieldType';

export default function FormAccordionItem({
    content,
    sectionTitle,
    deletable = false,
    index,
    suggest,
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
            forms,
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
            const validSection = validSections[subObject];
            let section = null;
            const currentSection = getSection(id);

            if (
                (!id && !validType && disabled) ||
                (savingSections.indexOf(currentSection) > -1 && disabled)
            ) {
                setDisabled(false);

                section = {
                    [subObject]: {
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
                    [subObject]: {
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
        [disabled, dispatch, savingSections, subObject, validSections]
    );

    const save = async () => {
        const currentSection = validSections[subObject];

        if (validSections && currentSection) {
            const valid = Object.values(currentSection).indexOf('error') < 0;

            const payload = {
                section: {
                    [subObject]: {
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
            const form = forms.find(
                (form) => Object.keys(form)[0] === formName
            )[formName];

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
                // TODO add to NotifService

                if (err === connexionNeeded || err === invalidToken) {
                    NotifService.info(
                        'Utilisateur inactif, rechargez votre page',
                        'error'
                    );
                } else {
                    NotifService.info(err, 'error');
                }
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
     * Rollback to init Section fields and delete all fields unSaved in indexDB and state
     * @returns {Promise<void>}
     */
    const resetSection = async () => {
        const validSection = validSections[subObject];
        const section = {
            [subObject]: {
                ...validSection,
                ...{ saved: true },
            },
        };
        const form = forms.find((form) => Object.keys(form)[0] === formName)[
            formName
        ];

        // get current section uids
        const uids = form.flatMap((field) => {
            const { uid, unSaved } = field;

            return checkFlatMap[uid.indexOf(subObject) > -1 && unSaved](uid);
        });

        // update global state
        dispatch({
            type: 'DELETE_FORM_FIELD_LIST',
            payload: {
                uids,
                formName,
            },
        });

        // update indexDB
        await DBService.deleteList(uids, formName);

        // rollback to init data
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

        // rollback disabled status
        resetDisabled(uids[0]);

        // update valid section with { saved: true } values
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
                return (
                    <div key={field.title}>
                        <Container>
                            <Row alignItems="middle" gutters>
                                <Col spacing="py-2w">
                                    <WrapperFieldType
                                        suggest={suggest}
                                        field={field}
                                        subObject={subObject}
                                        updateValidSection={updateValidSection}
                                        sectionTitle={sectionTitle}
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
                            dataTestId={`btn-delete-${subObject}`}
                            display={deletable}
                            title={sectionTitle}
                            onClick={async () =>
                                await deleteSection(
                                    subObject,
                                    index,
                                    sectionTitle
                                )
                            }
                        />
                        {/* TODO remove data-testId */}
                        <Col n="6 lg-2" className="txt-right">
                            <FieldButton
                                onClick={resetSection}
                                disabled={disabled}
                                colors={disabled ? [] : [white, orange]}
                                title="Annuler"
                                dataTestId={`${subObject}-resetSection-button`}
                            />
                        </Col>
                        <Col n="6 lg-2" className="txt-right">
                            <FieldButton
                                submit
                                disabled={disabled}
                                colors={disabled ? [] : [white, green]}
                                title="Sauvegarder"
                                dataTestId={`${subObject}-save-button`}
                            />
                        </Col>
                    </Row>
                </Container>
            </Row>
        </form>
    );
}
