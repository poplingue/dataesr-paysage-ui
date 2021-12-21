import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useCallback, useContext, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { cleanString } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
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
    deleteSection,
}) {
    const {
        stateForm: { validSections },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const { style: green } = useCSSProperty('--success-main-525');
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

    const save = () => {
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

            const { msg, type } = notif[valid ? 'valid' : 'error'];
            NotifService.techInfo(msg, type);
        }
    };

    return (
        <>
            {content.map((field) => {
                const {
                    type: fieldType,
                    infinite,
                    staticValues,
                    validatorId,
                } = field;
                const fieldTitle = field.title;

                return (
                    <div key={fieldTitle}>
                        <Container>
                            <Row alignItems="middle" gutters>
                                <Col spacing="py-2w">
                                    <SwitchField
                                        updateValidSection={updateValidSection}
                                        validatorId={validatorId}
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
                                    cleanString(title),
                                    index,
                                    newTitle
                                )
                            }
                        />
                        {/* TODO remove data-testId */}
                        <Col n="2" className="txt-right">
                            <FieldButton
                                disabled={disabled}
                                colors={disabled ? [] : ['#fff', green]}
                                onClick={save}
                                title="Sauvegarder"
                                dataTestId={`${cleanString(
                                    newTitle
                                )}-save-button`}
                            />
                        </Col>
                    </Row>
                </Container>
            </Row>
        </>
    );
}
