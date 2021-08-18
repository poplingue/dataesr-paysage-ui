import { Accordion, AccordionItem, Button, Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { createRef, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { cleanString, getForm, getFormName, getUniqueId, uniqueOnlyFilter } from '../../helpers/utils';
import FieldButton from '../FieldButton';
import Switch from '../Switch';

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

    const deleteSection = (sectionType, index, fieldType, newTitle) => {
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
        {Array.apply(null, { length: sections[type] || 1 }).map((v, i) => {
            if (!sections[type]) {
                updateSection(type, 1);
            }

            const newTitle = `${title}#${i}`;

            return <section
                data-section={dataAttSection}
                key={newTitle}
                ref={sectionRefs[i]}>
                <Accordion keepOpen>
                    <AccordionItem
                        initExpand
                        key={i}
                        title={newTitle}>
                        {content.map((field, j) => {
                            const { type: fieldType, title: fieldTitle, infinite, staticValues } = field;

                            return <div key={j}>
                                <Container>
                                    <Row alignItems="middle" gutters>
                                        <Col n="8">
                                            <Switch
                                                section={newTitle}
                                                keynumber={i}
                                                type={fieldType}
                                                title={fieldTitle}
                                                infinite={infinite}
                                                staticValues={staticValues}
                                            />
                                        </Col>
                                        {(sections[type] - 1 === i && i !== 0 && j === content.length - 1) &&
                                        <Col n="4">
                                            <FieldButton
                                                datatestid={`btn-delete-${cleanString(newTitle)}`}
                                                onClick={() => deleteSection(type, i, fieldTitle, newTitle)}
                                                title={`Delete ${newTitle}`}
                                            >
                                            </FieldButton>
                                        </Col>}
                                    </Row>
                                </Container>
                            </div>;
                        })}
                    </AccordionItem>
                </Accordion>
            </section>;
        })}
        <Button
            data-testid={`btn-add-${cleanString(type)}`}
            onClick={() => updateSection(type, sections[type] + 1)}>
            Add 1 {title}</Button>
    </>;
}
