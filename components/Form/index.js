import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useCallback, useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { getFormName, getSection, sectionUniqueId } from '../../helpers/utils';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import InfiniteAccordion from '../InfiniteAccordion';
import PageTheme from '../PageTheme';
import AccordionForm from './AccordionForm';
import FormAccordionItem from './FormAccordionItem';

const CreateForm = ({ jsonForm, color }) => {
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
    const [counter, setCounter] = useState({});

    /**
     * Update field retrieved
     * @type {(function(*): Promise<void>)|*}
     */
    const updateField = useCallback(
        async (field, objectStoreChecked) => {
            const { value, uid, unSaved } = field;

            const payload = {
                value,
                uid,
                unSaved,
            };

            if (value) {
                dispatch({
                    type: 'UPDATE_FORM_FIELD',
                    payload: { ...payload, formName },
                });

                if (objectStoreChecked) {
                    await DBService.set(payload, formName, false);
                }
            }
        },
        [dispatch, formName]
    );

    const retrieveIndexDBData = useCallback(
        async (objectStoreChecked) => {
            const indexDBData = await NotifService.promise(
                DBService.getAllObjects(formName, objectStoreChecked),
                'Data from IndexDB fetched'
            );
            indexDBData
                .filter((data) => data.unSaved === true)
                .forEach((elm) => {
                    const section = getSection(elm.uid);

                    if (section) {
                        dispatch({
                            type: 'ADD_SAVING_SECTION',
                            payload: { section },
                        });
                    }

                    updateField(elm, objectStoreChecked);
                });
        },
        [dispatch, formName, updateField]
    );

    useEffect(() => {
        const initIndexDBData = async () => {
            if (formName) {
                await retrieveIndexDBData(storeObjects.indexOf(formName) > -1);
            }
        };

        initIndexDBData();
    }, [
        updateField,
        storeObjects,
        formName,
        updateObjectId,
        dispatch,
        retrieveIndexDBData,
    ]);

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
