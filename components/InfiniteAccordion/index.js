import { Accordion, AccordionItem, Button, Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { createRef, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { cleanString, getForm, getFormName, getUniqueId, uniqueOnlyFilter } from '../../helpers/utils';
import FieldButton from '../FieldButton';
import Switch from '../Switch';
import styles from './InfiniteAcordion.module.scss';

export default function InfiniteAccordion({ title, content, dataAttSection }) {
    const { state: { forms }, dispatch } = useContext(AppContext);
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

    const deleteSection = (sectionType, index, newTitle) => {
        // DOM remove
        sectionRefs[index].current.removeChild(sectionRefs[index].current.children[0]);

        // indexDB & global state remove
        dispatch({
            type: 'DELETE_FORM_SECTION',
            payload: {
                section: getUniqueId(pathname, newTitle),
                formName,
                fieldsNumber: sections[type]
            }
        });

        // local state remove
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
                const deletable = (sections[type] - 1 === i && i !== 0);
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
                                            {content.map((field) => {
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
                                                                    keynumber={i}
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
                                        onClick={() => deleteSection(type, i, fieldTitle, newTitle)}
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
