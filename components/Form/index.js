import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { getFormName, sectionUniqueId } from '../../helpers/utils';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import InfiniteAccordion from '../InfiniteAccordion';
import PageTheme from '../PageTheme';
import AccordionForm from './AccordionForm';
import FormAccordionItem from './FormAccordionItem';

const CreateForm = ({ jsonForm, color, objectFormType }) => {
    const { Col, Row } = grid();

    const {
        stateForm: { storeObjects, updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);

    const retrieveField = useCallback(
        async (field) => {
            const { value, uid } = field;
            const checkStoreObject = storeObjects.indexOf(formName) > -1;

            if (value) {
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
            }
        },
        [dispatch, formName, storeObjects]
    );

    useEffect(() => {
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

        if (!updateObjectId) {
            getIndexDBData();
        } else {
            // Case data coming from DB
            DBService.clear(formName);
        }
    }, [retrieveField, storeObjects, formName, updateObjectId]);

    return (
        <PageTheme color={color}>
            <Row gutters>
                <Col n="12">
                    {jsonForm.form.map((section, i) => {
                        const {
                            title: sectionTitle,
                            subObject,
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
                                spacing={i === 0 ? '' : 'my-w'}
                                key={`${sectionTitle}-${i}`}
                            >
                                <InfiniteAccordion
                                    dataAttSection={dataSection}
                                    title={sectionTitle}
                                    subObjectType={subObject}
                                    content={content}
                                    index={`${sectionTitle}-${i}`}
                                />
                            </Col>
                        ) : (
                            <AccordionForm
                                key={i}
                                color={color}
                                dataSection={dataSection}
                                newTitle={sectionTitle}
                            >
                                <FormAccordionItem
                                    content={content}
                                    subObject={subObject}
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
