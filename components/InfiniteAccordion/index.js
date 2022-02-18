import { useRouter } from 'next/router';
import {
    createRef,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { genericErrorMsg } from '../../helpers/internalMessages';
import {
    cleanString,
    getForm,
    getFormName,
    getUniqueId,
    matchRegex,
    uniqueOnlyFilter,
} from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import FieldButton from '../FieldButton';
import AccordionForm from '../Form/AccordionForm';
import FormAccordionItem from '../Form/FormAccordionItem';
import WrapperAccordion from './WrapperAccordion';

// TODO refacto
export default function InfiniteAccordion({
    title,
    content,
    dataAttSection,
    subObjectType,
}) {
    const { Col, Row, Container } = grid();

    const { style: yellow } = useCSSProperty(
        '--green-tilleul-verveine-main-707'
    );
    const { style: dark } = useCSSProperty('--grey-425');
    const { style: white } = useCSSProperty('--grey-1000');

    const {
        pathname,
        query: { object },
    } = useRouter();
    const [init, setInit] = useState(true);
    const [sections, setSections] = useState(() => {
        return { [subObjectType]: [] };
    });
    const formName = getFormName(pathname, object);
    const {
        stateForm: { forms, storeObjects, updateObjectId },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const sectionRefs = useMemo(
        () =>
            Array(sections[subObjectType] || 1)
                .fill(0)
                .map(() => createRef()),
        [sections, subObjectType]
    );
    const sectionName = useMemo(
        () => getUniqueId(formName, subObjectType),
        [formName, subObjectType]
    );
    const currentForm = useCallback(
        () => getForm(forms, formName) || [],
        [formName, forms]
    );
    const formSections = useCallback(
        () =>
            currentForm().map((c) => {
                return c.uid;
            }),
        [currentForm]
    );

    const updateSection = useCallback(
        (ids) => {
            setSections((prev) => ({ ...prev, [subObjectType]: ids }));
        },
        [subObjectType]
    );

    const deleteSection = async (sectionType, index) => {
        let fieldsToDelete = [];
        const checkStoreObject = storeObjects.indexOf(formName) > -1;
        const subObjectId = !!sectionType.match(/[^#]*$/)
            ? sectionType.match(/[^#]*$/)[0]
            : sectionType;

        // TODO in sw.js
        await dataFormService.deleteSubObject(
            object,
            updateObjectId,
            subObjectType,
            subObjectId
        );

        for (let i = 1; i < currentForm().length; i = i + 1) {
            const { uid } = currentForm()[i];

            if (uid.indexOf(sectionType) > -1) {
                fieldsToDelete.push(uid);
            }
        }

        // remove stored fields
        if (fieldsToDelete.length) {
            // global state
            dispatch({
                type: 'DELETE_FORM_FIELD_LIST',
                payload: {
                    uids: fieldsToDelete,
                    formName,
                },
            });

            if (checkStoreObject) {
                // indexDB
                await DBService.deleteList(fieldsToDelete, formName);
            }
        }

        const idsRemaining = sections[subObjectType].filter(
            (id) => sectionType.indexOf(id) < 0
        );
        updateSection(idsRemaining);
    };

    const addSection = () => {
        dataFormService
            .initSubObject(object, subObjectType, updateObjectId)
            .then((data) => {
                updateSection([...sections[subObjectType], data.id]);
            })
            .catch((err) => {
                console.error('==== initSubObject Error ==== ', err);
                NotifService.info(genericErrorMsg, 'error');
            });
    };

    const check = useCallback(() => {
        return dataFormService
            .getSubObjectData(object, updateObjectId, subObjectType)
            .then(({ data }) => {
                const total = data.totalCount;

                return {
                    ids: data.data.map((subObject) => subObject.id),
                    total,
                };
            });
    }, [object, subObjectType, updateObjectId]);

    useEffect(() => {
        async function initSubObjects() {
            const { ids, total } = await check();

            updateSection(ids);

            if (sections[subObjectType].length === total) {
                setInit(false);
            }
        }

        if (init) {
            initSubObjects();
        }
    }, [check, init, sections, subObjectType, updateSection]);

    useEffect(() => {
        const sectionFields = formSections()
            .filter(uniqueOnlyFilter)
            .filter((k) => k.startsWith(sectionName));

        sectionFields.map((fieldId) => {
            const sectionId = matchRegex(`(?<=#).*(?=_)`, fieldId);
            // if(sections[subObjectType].length !== ){

            // updateSection(subObjectType, sectionId);
            // }
        });
    }, [formSections, sectionName, subObjectType, updateSection]);

    return (
        <div data-section={dataAttSection}>
            <Container fluid>
                <Row>
                    <Col n="12">
                        <ul className="p-0">
                            {sections[subObjectType] &&
                                sections[subObjectType].map((v, i) => {
                                    if (!!sections[subObjectType].length) {
                                        // updateSection(subObjectType, 1);
                                    }

                                    const newTitle = `${title}#${v}`;

                                    // TODO make it work with i !== 0 only
                                    const deletable = i !== 0;

                                    return (
                                        <WrapperAccordion
                                            key={`${dataAttSection}-${v}`}
                                            sectionRef={sectionRefs[i]}
                                            colSize="12"
                                        >
                                            <AccordionForm
                                                spacing={
                                                    i ===
                                                    sections[subObjectType]
                                                        .length -
                                                        1
                                                        ? 'mb-1w'
                                                        : 'mb-3w'
                                                }
                                                color={yellow}
                                                keepOpen
                                                newTitle={newTitle}
                                            >
                                                <FormAccordionItem
                                                    subObject={`${subObjectType}#${v}`}
                                                    content={content}
                                                    newTitle={newTitle}
                                                    deleteSection={
                                                        deleteSection
                                                    }
                                                    index={i + 1}
                                                    title={title}
                                                    deletable={deletable}
                                                />
                                            </AccordionForm>
                                        </WrapperAccordion>
                                    );
                                })}
                        </ul>
                    </Col>
                    <Col spacing="pb-4w">
                        <FieldButton
                            colors={[dark, white]}
                            icon="ri-add-line"
                            title={`Ajouter un(e) « ${title} »`}
                            dataTestId={`btn-add-${cleanString(subObjectType)}`}
                            onClick={addSection}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
