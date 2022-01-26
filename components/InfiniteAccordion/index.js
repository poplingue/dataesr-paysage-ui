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
import {
    cleanString,
    getForm,
    getFormName,
    getUniqueId,
    uniqueOnlyFilter,
} from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import DBService from '../../services/DB.service';
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
    const [sections, setSections] = useState({});
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
                return c.uid.split('_')[0];
            }),
        [currentForm]
    );

    const updateSection = useCallback((type, nb) => {
        setSections((prev) => ({ ...prev, [type]: nb }));
    }, []);

    const deleteSection = async (sectionType, index) => {
        let fieldsToDelete = [];
        let fieldsToUpdate = [];
        const checkStoreObject = storeObjects.indexOf(formName) > -1;

        // TODO dynamic
        // TODO in sw.js
        await dataFormService.deleteSubObject(
            'structure',
            updateObjectId,
            subObjectType,
            sections[subObjectType]
        );

        // Reassign Section's fields value...
        for (let i = 1; i < currentForm().length; i = i + 1) {
            const { uid, value } = currentForm()[i];

            // get #id of section contained in uid
            const reg = new RegExp(`(?<=@${sectionType}).*(?=\_)`, 'g');
            const match = uid.match(reg);
            const id = match ? parseInt(match[0].substring(1)) : null;

            if (id && id === index) {
                fieldsToDelete.push(uid);
            }

            if (id && id > index) {
                const sectionReg = /@.+?_/g.exec(uid);
                const newUid = uid.replace(
                    sectionReg[0],
                    `@${sectionType}#${id - 1}_`
                );

                fieldsToUpdate.push({ value, uid: newUid });
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
                    fieldsNumber: sections[subObjectType],
                },
            });

            if (checkStoreObject) {
                // indexDB
                await DBService.deleteList(fieldsToDelete, formName);
            }
        }

        // update stored fields
        if (fieldsToUpdate.length) {
            // global state
            dispatch({
                type: 'UPDATE_FORM_FIELD_LIST',
                payload: {
                    fields: fieldsToUpdate,
                    formName,
                },
            });

            if (checkStoreObject) {
                // indexDB
                await DBService.setList(fieldsToUpdate, formName);
            }
        }

        // local state retrieve one section
        updateSection(sectionType, sections[subObjectType] - 1);
    };

    const addSection = () => {
        updateSection(subObjectType, sections[subObjectType] + 1);
        // TODO dynamic
        dataFormService.initSubObject(
            'structure',
            subObjectType,
            updateObjectId
        );
    };

    useEffect(() => {
        const sectionFields = formSections()
            .filter(uniqueOnlyFilter)
            .filter((k) => k.startsWith(sectionName));

        updateSection(subObjectType, sectionFields.length);
    }, [formSections, sectionName, subObjectType, updateSection]);

    return (
        <div data-section={dataAttSection}>
            <Container fluid>
                <Row>
                    <Col n="12">
                        <ul className="p-0">
                            {Array.apply(null, {
                                length: sections[subObjectType] || 1,
                            }).map((v, i) => {
                                if (!sections[subObjectType]) {
                                    updateSection(subObjectType, 1);
                                }

                                const newTitle = `${title}#${i + 1}`;
                                // TODO make it work with i !== 0 only
                                const deletable = i !== 0;

                                return (
                                    <div key={`${dataAttSection}-${i}`}>
                                        <WrapperAccordion
                                            sectionRef={sectionRefs[i]}
                                            colSize="12"
                                        >
                                            <AccordionForm
                                                spacing={
                                                    i ===
                                                    sections[subObjectType] - 1
                                                        ? 'mb-1w'
                                                        : 'mb-3w'
                                                }
                                                color={yellow}
                                                keepOpen
                                                newTitle={newTitle}
                                            >
                                                <FormAccordionItem
                                                    subObject={`${subObjectType}#${
                                                        i + 1
                                                    }`}
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
                                    </div>
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
