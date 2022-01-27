import { useRouter } from 'next/router';
import { useCallback, useContext, useMemo, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { cleanString, getFormName, getUniqueId } from '../../helpers/utils';
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
        stateForm: { validSections, updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const sectionName = useMemo(
        () => getUniqueId(formName, subObject),
        [formName, subObject]
    );

    const { style: green } = useCSSProperty('--success-main-525');
    const { style: white } = useCSSProperty('--grey-1000');
    const [disabled, setDisabled] = useState(true);

    const updateValidSection = useCallback(
        (id, validType) => {
            const title = cleanString(newTitle);
            const section = validSections[title];
            let payload = null;

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
        [newTitle, dispatch, validSections, disabled]
    );

    const save = async () => {
        const title = cleanString(newTitle);
        const currentSection = validSections[title];

        if (validSections && currentSection) {
            const valid = Object.values(currentSection).indexOf('error') < 0;

            if (valid) {
                setDisabled(true);
            }

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
            const form = await DBService.getAllObjects(formName, true);
            const uids = [];
            const filteredForm = form.filter((f) => {
                return (
                    ((f.unSaved && !f.infinite) || f.infinite) &&
                    f.uid.indexOf(`${subObject}`) > -1
                );
            });

            dataFormService
                .save(filteredForm, updateObjectId, subObject)
                .then(async () => {
                    for (let i = 1; i < filteredForm.length; i = i + 1) {
                        const uid = filteredForm[i].uid;

                        if (uid.startsWith(sectionName)) {
                            uids.push(uid);
                        }
                    }

                    DBService.deleteList(uids, formName).then(() => {
                        const { msg, type } = notif[valid ? 'valid' : 'error'];
                        NotifService.info(msg, type);
                    });
                })
                .catch((err) => {
                    NotifService.info(err, 'error');
                });
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        save();
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
                            onclick={async () =>
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
