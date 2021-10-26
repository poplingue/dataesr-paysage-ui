import { Accordion, AccordionItem, Button, Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { createRef, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { cleanString, getForm, getFormName, getUniqueId, uniqueOnlyFilter } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import DBService from '../../services/DBService';
import FieldButton from '../FieldButton';
import Switch from '../Switch';
import styles from './InfiniteAcordion.module.scss';

export default function InfiniteAccordion({ title, content, dataAttSection, accordionsExpanded }) {
    const { style: yellow } = useCSSProperty('--yellow-dark-700');
    const { stateForm: { forms, storeObjects }, dispatchForm: dispatch } = useContext(AppContext);
    const { pathname, query: { object } } = useRouter();
    const [sections, setSections] = useState({});
    const type = cleanString(title);
    const formName = getFormName(pathname, object);
    const sectionRefs = useMemo(() => Array(sections[type] || 1).fill(0).map(() => createRef()), [sections, type]);
    const sectionName = useMemo(() => getUniqueId(formName, type), [pathname, type]);
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
        for (let i = 0; i < currentForm().length; i = i + 1) {

            const { uid, value } = currentForm()[i];
            // get id of section based on uid
            const reg = new RegExp(`(?<=@${sectionType}).*(?=\/)`, 'g');
            const match = uid.match(reg);
            const id = match ? parseInt(match[0].substring(1)) : null;

            if (id && (id === index || id === sections[type] - 1)) {
                fieldsToDelete.push(uid);
            }

            if (id && id > index) {
                const sectionReg = (/@.+?\//g).exec(uid);
                const newUid = uid.replace(sectionReg[0], `@${sectionType}#${id - 1}/`);

                fieldsToUpdate.push({ value, uid: newUid });
                fieldsToDelete.push(uid);
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

    return <div data-section={dataAttSection}>
        <Container fluid>
            <Row>
                <Col n="12">
                    <ul className="p-0">
                        {Array.apply(null, { length: sections[type] || 1 }).map((v, i) => {
                            if (!sections[type]) {
                                updateSection(type, 1);
                            }

                            const newTitle = `${title}#${i}`;
                            // TODO make it work with i !== 0 only
                            const deletable = i !== 0;
                            let fieldTitle = '';
                            // TODO refacto data-sub-section

                            return <li className={styles.Accordion} key={newTitle}>
                                <section
                                    data-sub-section={`${dataAttSection}#${i}`}
                                    ref={sectionRefs[i]}>
                                    <Container fluid>
                                        <Row gutters>
                                            <Col n={deletable ? '10' : '12'}>
                                                <Accordion
                                                    color={yellow}
                                                    keepOpen
                                                    data-cy="accordion"
                                                    size="lg">
                                                    <AccordionItem
                                                        initExpand={accordionsExpanded}
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
                                                    dataTestid={`btn-delete-${cleanString(title)}#${i}`}
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
                </Col>
                <Col>
                    <div className={styles.Button}>
                        <Button
                            icon="ri-add-line"
                            size="sm"
                            data-testid={`btn-add-${cleanString(type)}`}
                            onClick={() => updateSection(type, sections[type] + 1)}>
                            Add 1 {title}</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>;
}
