import { Accordion, AccordionItem, Container, Col, Row } from '@dataesr/react-dsfr';
import Switch from '../Switch';
import InfiniteAccordion from '../InfiniteAccordion';
import { AppContext } from '../../context/GlobalState';
import DBService from '../../services/DBService';
import { useEffect, useContext, useCallback, useState } from 'react';

const CreateForm = ({ jsonForm }) => {
    const { state: { formName, storeObjects, objectStoreName }, dispatch } = useContext(AppContext);
    const [fieldIds, setFieldIds] = useState([]);

    const getField = useCallback((field) => {
        const { value, uid, } = field;
        setFieldIds((prev) => [...prev, field.uid]);
        dispatch({ type: 'UPDATE_FORM_FIELD', payload: { value, uid, formName: formName } });
    }, [dispatch, formName]);

    useEffect(() => {
        // TODO refacto objectStoreName===formName??
        dispatch({ type: 'UPDATE_CURRENT_OBJECT_STORE', payload: { objectStoreName: formName } });
    }, [dispatch, formName]);

    useEffect(() => {
        console.debug('==== DEBUG ==== ', formName);
        const getIndexDBData = async () => {
            if (objectStoreName) {
                const indexDBData = await DBService.getAll(objectStoreName, storeObjects.indexOf(formName) > -1);
                indexDBData.forEach((elm) => {
                    getField(elm);
                });
            }
        };
        getIndexDBData();
    }, [getField, formName, objectStoreName, storeObjects]);
    return <>
        {jsonForm.form.map((section, i) => {
            const { title: sectionTitle, content, infinite } = section;

            return infinite ? <InfiniteAccordion
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
                                            keyNumber={i}
                                            section={sectionTitle}
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
