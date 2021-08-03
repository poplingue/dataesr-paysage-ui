import { Accordion, AccordionItem, Container, Col, Row } from '@dataesr/react-dsfr';
import Switch from '../Switch';
import AccordionInfinite from '../AccordionInfinite';

const CreateForm = ({ jsonForm }) => {

    return <>
        {jsonForm.form.map((section, i) => {
            const { title: sectionTitle, content, infinite } = section;

            return infinite ? <AccordionInfinite
                title={sectionTitle}
                content={content}
                key={i}/> : <Accordion key={i} keepOpen>
                <AccordionItem
                    initExpand
                    title={sectionTitle}>
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
