import { Accordion, AccordionItem, Button, Container, Col, Row } from '@dataesr/react-dsfr';
import Switch from '../Switch';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import cleanString from '../../helpers/utils';
import AccordionInfinite from '../AccordionInfinite';

const CreateForm = ({ jsonForm }) => {
    const [sections, setSections] = useState({});
    const updateSection = (type, nb) => {
        setSections((prev) => ({ ...prev, [type]: nb }));
    };
    return <>
        {jsonForm.form.map((section) => {
            const { title, content, position, infinite } = section;
            const type = cleanString(title);
            const sectionTitle = title;
            if (Object.keys(sections).length < jsonForm.form.length) {
                updateSection(type, sections[type] || 1);
            }
            return infinite ? <AccordionInfinite
                title={sectionTitle}
                type={type}
                updateSection={updateSection}
                content={content}
                key={uuidv4()}
                nb={sections[type] || 1}/> : <Accordion keepOpen>
                <AccordionItem
                    key={uuidv4()}
                    initExpand
                    title={title}>
                    {content.map((field, j) => {
                        const { type, title, infinite, staticValues } = field;
                        return <div key={j}>
                            <Container>
                                <Row alignItems="middle">
                                    <Col>
                                        <Switch
                                            type={type}
                                            title={title}
                                            infinite={infinite}
                                            staticValues={staticValues}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </div>;
                    })}
                </AccordionItem>
            </Accordion>;
        })}
    </>;
};

export default CreateForm;
