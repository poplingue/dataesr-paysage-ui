import { Accordion, AccordionItem, Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFormName, sectionUniqueId } from '../../helpers/utils';
import DBService from '../../services/DBService';
import NotifService from '../../services/NotifService';
import InfiniteAccordion from '../InfiniteAccordion';
import Switch from '../Switch';

const CreateForm = ({ jsonForm }) => {
    const { state: { storeObjects }, dispatch } = useContext(AppContext);
    const { pathname } = useRouter();
    const formName = getFormName(pathname);

    const retrieveField = useCallback((field) => {
        const { value, uid, } = field;
        dispatch({ type: 'UPDATE_FORM_FIELD', payload: { value, uid, formName } });
    }, [dispatch, formName]);

    useEffect(() => {

        const getIndexDBData = async () => {
            if (storeObjects.indexOf(formName) > -1 && formName) {
                const indexDBData = await NotifService.fetching(DBService.getAllObjects(formName, storeObjects.indexOf(formName) > -1), 'Data from IndexDB fetched');
                indexDBData.forEach((elm) => {
                    retrieveField(elm);
                });
            }
        };

        getIndexDBData();
    }, [retrieveField, storeObjects, formName]);

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
                                            keynumber={i}
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
