import { Accordion, AccordionItem, Container, Col, Row } from '@dataesr/react-dsfr';
import Switch from '../Switch';
import InfiniteAccordion from '../InfiniteAccordion';
import { AppContext } from '../../context/GlobalState';
import DBService from '../../services/DBService';
import { useEffect, useContext, useCallback, useState, forwardRef, createRef } from 'react';
import NotifService from '../../services/NotifService';
import { cleanString, sectionUniqueId } from '../../helpers/utils';

const CreateForm = ({ jsonForm }) => {
    const { state: { formName, storeObjects, objectStoreName }, dispatch } = useContext(AppContext);
    const [fieldIds, setFieldIds] = useState([]);

    const getField = useCallback((field) => {
        const { value, uid, } = field;
        setFieldIds((prev) => [...prev, field.uid]);
        dispatch({ type: 'UPDATE_FORM_FIELD', payload: { value, uid, formName } });
    }, [dispatch, formName]);

    useEffect(() => {
        // TODO refacto objectStoreName===formName??
        dispatch({ type: 'UPDATE_CURRENT_OBJECT_STORE', payload: { objectStoreName: formName } });
    }, [dispatch, formName]);

    useEffect(() => {
        const getIndexDBData = async () => {
            if (objectStoreName) {
                const indexDBData = await NotifService.fetching(DBService.getAllObjects(objectStoreName, storeObjects.indexOf(formName) > -1), 'Data from IndexDB fetched');
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
            const dataSection = sectionUniqueId(sectionTitle, content.length);

            return infinite ? <InfiniteAccordion
                dataAttSection={dataSection}
                title={sectionTitle}
                content={content}
                key={i}/> : <Accordion keepOpen key={i} data-section={dataSection}>
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
