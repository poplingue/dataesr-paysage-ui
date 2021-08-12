import { Accordion, AccordionItem, Container, Col, Row } from '@dataesr/react-dsfr';
import Switch from '../Switch';
import InfiniteAccordion from '../InfiniteAccordion';
import { useRouter } from 'next/router';
import { AppContext } from '../../context/GlobalState';
import DBService from '../../services/DBService';
import { getFormName } from '../../helpers/utils';
import { useEffect, useContext, useCallback, useState } from 'react';

const CreateForm = ({ jsonForm }) => {
    const router = useRouter();
    const { state, dispatch } = useContext(AppContext);
    const [fieldIds, setFieldIds] = useState([]);

    const getField = useCallback((field) => {
        const { value, uid, } = field;
        if (fieldIds.indexOf(uid) === -1) {
            setFieldIds((prev) => [...prev, field.uid]);
            dispatch({ type: 'UPDATE_FORM_FIELD', payload: { value, uid, formName: state.objectStoreName } });
        }
    }, [fieldIds, dispatch, state.objectStoreName]);

    useEffect(() => {
        dispatch({ type: 'UPDATE_CURRENT_OBJECT_STORE', payload: { objectStoreName: getFormName(router.pathname) } });
    }, [dispatch]);
    useEffect(() => {
        const getIndexDBData = async () => {
            if (state.objectStoreName) {
                await DBService.getAll(state.objectStoreName, getField, state.storeObjects.indexOf(getFormName(router.pathname)) > -1);
            }
        };
        getIndexDBData();
    }, [getField, router.pathname, state.objectStoreName, state.storeObjects]);
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
