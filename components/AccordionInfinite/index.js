import cleanString from '../../helpers/utils';
import { Accordion, AccordionItem, Button, Col, Container, Row } from '@dataesr/react-dsfr';
import Switch from '../Switch';
import { v4 as uuidv4 } from 'uuid';
import { useMemo, createRef } from 'react';

export default function AccordionInfinite({ nb, title, type, content, updateSection }) {
    const handleDeleteSection = (sectionDataItem, sectionDataPosition, sectionType, index) => {
        inputRefs[index].current.removeChild(inputRefs[index].current.children[0]);
        updateSection(cleanString(sectionType), nb - 1);
    };
    const inputRefs = useMemo(() => Array(nb).fill(0).map(i => createRef()), [nb]);
    return <>
        {Array.apply(null, { length: nb }).map((v, i) => {
            const newTitle = `${title} #${i}`;
            const sectionDataItem = `accordion-item-${cleanString(type)}`;
            const sectionDataPosition = `accordion-item-${cleanString(type)}-${i}`;
            return <div key={uuidv4()}
                        data-item={sectionDataItem}
                        data-position={sectionDataPosition}
                        ref={inputRefs[i]}>
                {<Accordion keepOpen>
                    <AccordionItem
                        initExpand
                        className="p-relative"
                        key={uuidv4()}
                        title={newTitle}>
                        {content.map((field, j) => {
                            const { type: currentType, title: currentTitle, infinite, staticValues } = field;
                            return <div key={j}>
                                <Container>
                                    <Row alignItems="middle">
                                        <Col n="12">
                                            <Button
                                                size="sm"
                                                onClick={() => handleDeleteSection(sectionDataItem, sectionDataPosition, type, i)}>
                                                Delete {newTitle}
                                            </Button>
                                        </Col>
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
                            </div>
                        })}
                    </AccordionItem>
                </Accordion>}
            </div>;
        })}
        <Button
            className="p-absolute"
            onClick={() => updateSection(type, nb + 1)}>
            Add 1 {title}</Button>
    </>;
}