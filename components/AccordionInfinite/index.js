import { cleanString } from '../../helpers/utils';
import { Accordion, AccordionItem, Button, Col, Container, Row } from '@dataesr/react-dsfr';
import Switch from '../Switch';
import { useState, useMemo, createRef } from 'react';

export default function AccordionInfinite({ title, content }) {
    // TODO manage with IndexDB
    const [sections, setSections] = useState({});
    const type = cleanString(title);
    const sectionRefs = useMemo(() => Array(sections[type] || 1).fill(0).map(() => createRef()), [sections, type]);
    const updateSection = (type, nb) => {
        setSections((prev) => ({ ...prev, [type]: nb }));
    };
    const deleteSection = (sectionType, index) => {
        // DOM remove
        sectionRefs[index].current.removeChild(sectionRefs[index].current.children[0]);
        // state remove
        updateSection(sectionType, sections[type] - 1);

    };
    return <>
        {Array.apply(null, { length: sections[type] || 1 }).map((v, i) => {
            if (!sections[type]) {
                updateSection(type, 1);
            }
            const newTitle = `${title} #${i}`;
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
                            const { type: currentType, title: currentTitle, infinite, staticValues } = field;
                            return <div key={j}>
                                <Container>
                                    <Row alignItems="middle">
                                        {(sections[type] - 1 === i && i !== 0) && <Col n="12">
                                            <Button
                                                size="sm"
                                                onClick={() => deleteSection(type, i)}>
                                                Delete {newTitle}
                                            </Button>
                                        </Col>}
                                        <Col n="12">
                                            <Switch
                                                type={currentType}
                                                title={currentTitle}
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
            </section>;
        })}
        <Button
            onClick={() => updateSection(type, sections[type] + 1)}>
            Add 1 {title}</Button>
    </>;
}