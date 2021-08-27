import { Accordion, AccordionItem, Button, Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { createRef, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { cleanString, getForm, getFormName, getUniqueId, uniqueOnlyFilter } from '../../helpers/utils';
import DBService from '../../services/DBService';
import FieldButton from '../FieldButton';
import Switch from '../Switch';
import styles from './InfiniteAcordion.module.scss';

export default function InfiniteAccordion({ title, content, dataAttSection }) {
    const { state: { forms, storeObjects }, dispatch } = useContext(AppContext);
    const { pathname } = useRouter();
    const [sections, setSections] = useState({});
    const type = cleanString(title);
    const formName = getFormName(pathname);
    const sectionRefs = useMemo(() => Array(sections[type] || 1).fill(0).map(() => createRef()), [sections, type]);
    const sectionName = useMemo(() => getUniqueId(pathname, type), [pathname, type]);
    const currentForm = useCallback(() => getForm(forms, formName) || [], [formName, forms]);
    const formSections = useCallback(() => currentForm().map((c) => c.uid.split('/').slice(0, 2).join('/')), [currentForm]);

    const updateSection = useCallback((type, nb) => {
        setSections((prev) => ({ ...prev, [type]: nb }));
    }, []);

    const deleteSection = async (sectionType, index, newTitle) => {
        let fieldsToDelete = [];
        let fieldsToUpdate = [];
        const checkStoreObject = storeObjects.indexOf(formName) > -1;

        // Reassign Section's fields value...
        for (let i = 0; i <= currentForm().length; i = i + 1) {

            const currentField = currentForm()[i];

            // TODO why need to check currentField?
            if (currentField) {
                // get id of section based on uid
                const reg = new RegExp(`(?<=@${sectionType}).*(?=\/)`, 'g');
                const match = currentField.uid.match(reg);
                const id = match ? parseInt(match[0].substring(1)) : null;

                if (id && id === index) {
                    fieldsToDelete.push(currentField.uid);
                }

                if (id && id === sections[type] - 1) {
                    fieldsToDelete.push(currentField.uid);
                }

                const sectionReg = (/@.+?\//g).exec(currentField.uid);
                const newUid = currentField.uid.replace(sectionReg[0], `@${sectionType}#${id - 1}/`);

                if (id && id > index) {
                    fieldsToUpdate.push({ value: currentField.value, uid: newUid });
                    fieldsToDelete.push(currentField.uid);
                }
            }
        }

        // remove stored fields
        if (fieldsToDelete.length) {
            // global state
            dispatch({
                type: 'DELETE_FORM_FIELD_LIST',
                payload: {
                    uids: fieldsToDelete,
                    formName,
                    fieldsNumber: sections[type]
                }
            });

            if (checkStoreObject) {
                // indexDB
                await DBService.deleteList(fieldsToDelete, formName);
            }
        }

        // update stored fields
        if (fieldsToUpdate.length) {

            // global state
            dispatch({
                type: 'UPDATE_FORM_FIELD_LIST',
                payload: {
                    fields: fieldsToUpdate,
                    formName,
                }
            });

            if (checkStoreObject) {
                // indexDB
                // TODO DBService.setAll
                await DBService.setList(fieldsToUpdate, formName);
            }
        }

        // local state retrieve one section
        updateSection(sectionType, sections[type] - 1);
    };

    useEffect(() => {
        const sectionFields = formSections().filter(uniqueOnlyFilter).filter((k) => {
            return k.startsWith(sectionName);
        });
        updateSection(type, sectionFields.length);

    }, [formSections, sectionName, type, updateSection]);

    return <>
        <ul>
            {Array.apply(null, { length: sections[type] || 1 }).map((v, i) => {
                if (!sections[type]) {
                    updateSection(type, 1);
                }

                const newTitle = `${title}#${i}`;
                // TODO make it work with i !== 0 only
                const deletable = i !== 0;
                let fieldTitle = '';

                return <li className={styles.Accordion} key={newTitle}>
                    <section
                        data-sub-section={`${dataAttSection}#${i}`}
                        ref={sectionRefs[i]}>
                        <Container fluid>
                            <Row gutters>
                                <Col n={deletable ? '10' : '12'}>
                                    <Accordion keepOpen>
                                        <AccordionItem
                                            initExpand
                                            className={styles.Item}
                                            key={newTitle}
                                            title={newTitle}>
                                            {content.map((field, j) => {
                                                const {
                                                    type: fieldType,
                                                    infinite,
                                                    staticValues
                                                } = field;

                                                fieldTitle = field.title;

                                                return <div key={fieldTitle}>
                                                    <Container>
                                                        <Row alignItems="middle" gutters>
                                                            <Col>
                                                                <Switch
                                                                    section={newTitle}
                                                                    type={fieldType}
                                                                    title={fieldTitle}
                                                                    infinite={infinite}
                                                                    staticValues={staticValues}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </Container>
                                                </div>;
                                            })}
                                        </AccordionItem>
                                    </Accordion>
                                </Col>
                                {deletable &&
                                <Col n="2">
                                    <FieldButton
                                        datatestid={`btn-delete-${cleanString(newTitle)}`}
                                        onClick={() => deleteSection(type, i, newTitle)}
                                        title="Supprimer"
                                    >
                                    </FieldButton>
                                </Col>
                                }
                            </Row>
                        </Container>
                    </section>
                </li>;
            })}</ul>
        <Container fluid>
            <Row>
                <Col>
                    <div className={styles.Button}>
                        <Button
                            icon="ri-add-line"
                            secondary
                            size="sm"
                            data-testid={`btn-add-${cleanString(type)}`}
                            onClick={() => updateSection(type, sections[type] + 1)}>
                            Add 1 {title}</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    </>;
}
