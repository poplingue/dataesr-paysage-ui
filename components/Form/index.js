import { Col, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import { getFormName, sectionUniqueId } from '../../helpers/utils';
import DBService from '../../services/DBService';
import NotifService from '../../services/NotifService';
import FieldButton from '../FieldButton';
import InfiniteAccordion from '../InfiniteAccordion';
import PageTheme from '../PageTheme';
import AccordionForm from './AccordionForm';
import styles from './Form.module.scss';
import FormAccordionItem from './FormAccordionItem';

const CreateForm = ({ jsonForm, color, objectFormType }) => {
    const {
        stateForm: { storeObjects },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const [accordionsExpanded, setAccordionsExpanded] = useState(true);

    const simulateClick = (elem) => {
        const evt = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        // If cancelled, don't dispatch our event
        const canceled = !elem.dispatchEvent(evt);

        setAccordionsExpanded(!accordionsExpanded);
    };

    const expandCloseAll = () => {
        const open = accordionsExpanded ? 'true' : 'false';
        const btnAccordions = document.querySelectorAll(
            `.fr-accordion__btn[aria-expanded="${open}"]`
        );

        for (let i = 0; i < btnAccordions.length; i = i + 1) {
            simulateClick(btnAccordions[i]);
        }
    };

    const retrieveField = useCallback(
        async (field) => {
            const { value, uid } = field;
            const checkStoreObject = storeObjects.indexOf(formName) > -1;

            dispatch({
                type: 'UPDATE_FORM_FIELD',
                payload: { value, uid, formName },
            });

            if (checkStoreObject) {
                await DBService.set(
                    {
                        value,
                        uid,
                    },
                    formName
                );
            }
        },
        [dispatch, formName, storeObjects]
    );

    useEffect(() => {
        // TODO in middleware?
        dispatch({ type: 'UPDATE_OBJECT_FORM_TYPE', payload: objectFormType });
    }, [dispatch, objectFormType]);

    useEffect(() => {
        const getIndexDBData = async () => {
            // TODO refacto
            if (storeObjects.indexOf(formName) > -1 && formName) {
                const indexDBData = await NotifService.promise(
                    DBService.getAllObjects(
                        formName,
                        storeObjects.indexOf(formName) > -1
                    ),
                    'Data from IndexDB fetched'
                );
                indexDBData.forEach((elm) => {
                    retrieveField(elm);
                });
            }
        };

        getIndexDBData();
    }, [retrieveField, storeObjects, formName]);

    return (
        <PageTheme color={color}>
            <Row>
                <Col offset="10" n="2" className="p-relative">
                    <FieldButton
                        className={styles.Button}
                        dataTestId="btn-expand-close"
                        title="Réduire / Étendre"
                        onClick={expandCloseAll}
                    />
                </Col>
                <Col n="12">
                    {jsonForm.form.map((section, i) => {
                        const {
                            title: sectionTitle,
                            content,
                            infinite,
                        } = section;

                        const dataSection = sectionUniqueId(
                            sectionTitle,
                            content.length
                        );

                        // TODO https://www.chakshunyu.com/blog/how-to-write-readable-react-content-states/?ck_subscriber_id=1366272460

                        return infinite ? (
                            <Col
                                spacing={i === 0 ? '' : 'mt-6w'}
                                key={`${sectionTitle}-${i}`}
                            >
                                <InfiniteAccordion
                                    accordionsExpanded={accordionsExpanded}
                                    dataAttSection={dataSection}
                                    title={sectionTitle}
                                    content={content}
                                    index={`${sectionTitle}-${i}`}
                                />
                            </Col>
                        ) : (
                            <AccordionForm
                                key={i}
                                color={color}
                                keepOpen
                                initExpand={accordionsExpanded}
                                dataSection={dataSection}
                                newTitle={sectionTitle}
                            >
                                <FormAccordionItem
                                    content={content}
                                    newTitle={sectionTitle}
                                />
                            </AccordionForm>
                        );
                    })}
                </Col>
            </Row>
        </PageTheme>
    );
};

CreateForm.propTypes = {
    jsonForm: PropTypes.shape({
        form: PropTypes.arrayOf(
            PropTypes.shape({
                content: PropTypes.arrayOf(
                    PropTypes.shape({
                        title: PropTypes.string,
                        type: PropTypes.string,
                        validatorId: PropTypes.string,
                    })
                ),
                infinite: PropTypes.bool,
                title: PropTypes.string,
            })
        ),
    }).isRequired,
    color: PropTypes.string,
    objectFormType: PropTypes.oneOf(['person', 'structure']).isRequired,
};

export default CreateForm;
