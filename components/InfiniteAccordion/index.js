import { cleanString, uniqueOnlyFilter, getFormName, getUniqueId } from '../../helpers/utils';
import { Accordion, AccordionItem, Button, Col, Container, Row } from '@dataesr/react-dsfr';
import Switch from '../Switch';
import { useState, useMemo, createRef, useContext, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import { useRouter } from 'next/router';

export default function InfiniteAccordion({ title, content }) {
    // TODO manage with IndexDB
    const { state, dispatch } = useContext(AppContext);
    const router = useRouter();
    const [sections, setSections] = useState({});
    const type = cleanString(title);
    const sectionRefs = useMemo(() => Array(sections[type] || 1).fill(0).map(() => createRef()), [sections, type]);
    const updateSection = (type, nb) => {
        setSections((prev) => ({ ...prev, [type]: nb }));
    };
    const deleteSection = (sectionType, index, fieldType, newTitle) => {
        // DOM remove
        sectionRefs[index].current.removeChild(sectionRefs[index].current.children[0]);

        // local state remove
        updateSection(sectionType, sections[type] - 1);

        // indexDB & global state remove
        dispatch({
            type: 'DELETE_FORM_SECTION',
            payload: {
                section: getUniqueId(router.pathname, newTitle),
                formName: getFormName(router.pathname),
                fieldsNumber: sections[type]
            }
        });
    };
    useEffect(() => {
        const currentForm = Object.keys(state.forms[getFormName(router.pathname)]);
        const formSections = currentForm.map((c) => c.split('/').slice(0, 2).join('/'));
        const initInfinite = formSections.filter(uniqueOnlyFilter).filter((k) => {
            return k.startsWith(getUniqueId(router.pathname, type));
        });

        updateSection(type, initInfinite.length);

    }, [state.forms, router.pathname, title, type]);
    return <>
        {Array.apply(null, { length: sections[type] || 1 }).map((v, i) => {
            if (!sections[type]) {
                updateSection(type, 1);
            }
            const newTitle = `${title}#${i}`;
            return <section
                key={newTitle}
                data-item={i}
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
                                                keyNumber={i}
                                                type={fieldType}
                                                title={fieldTitle}
                                                infinite={infinite}
                                                staticValues={staticValues}
                                            />
                                        </Col>
                                        {(sections[type] - 1 === i && i !== 0 && j === content.length - 1) &&
                                        <Col n="4">
                                            <Button
                                                size="sm"
                                                onClick={() => deleteSection(type, i, fieldTitle, newTitle)}>
                                                Delete {newTitle}
                                            </Button>
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
            onClick={() => updateSection(type, sections[type] + 1)}>
            Add 1 {title}</Button>
    </>;
}
