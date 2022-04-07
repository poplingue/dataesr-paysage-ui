import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { getObjectTypeDetails } from '../../config/utils';
import { AppContext } from '../../context/GlobalState';
import { getFormName } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import FieldButton from '../FieldButton';
import CreateForm from '../Form';
import HeaderLayout from '../HeaderLayout';
import LinkTo from '../LinkTo';
import ToolBox from '../ToolBox';
import ContribOfficialDocumentForm from './form.json';

export default function ContribOfficialDocument({ data, id }) {
    const {
        stateForm: { departments, storeObjects, currentFormObject },
        dispatchForm: dispatch,
    } = useContext(AppContext);

    const [published, setPublished] = useState(
        currentFormObject.status === 'published'
    );

    const { style: green } = useCSSProperty('--success-main-525');
    const { style: white } = useCSSProperty('--grey-1000');
    const {
        pathname,
        query: { object },
    } = useRouter();

    const { style: blue } = useCSSProperty(
        getObjectTypeDetails('', object).color
    );

    const objCheck = useCallback(
        (keyA, keyB) => {
            return {
                false: () => currentFormObject[keyA] || '',
                true: () => currentFormObject[keyB] || '',
            };
        },
        [currentFormObject]
    );

    const formName = getFormName(pathname, object);
    const [initData, setInitData] = useState(false);
    const [editor, setEditor] = useState('');
    const [dateInfo, setDateInfo] = useState('');

    useEffect(() => {
        if (data && !departments.length) {
            dispatch({ type: 'UPDATE_DEPARTMENTS', payload: data });
        }
    });

    const initDataStructureForm = useCallback(async () => {
        dataFormService
            .initFormSections(object, id, formName, storeObjects)
            .then(async (fields) => {
                // Update fields in state
                dispatch({
                    type: 'UPDATE_FORM_FIELD_LIST',
                    payload: {
                        formName,
                        fields,
                    },
                });

                // indexDB
                await DBService.setList(fields, formName);
            });
    }, [dispatch, formName, id, object, storeObjects]);

    const publishObject = () => {
        dataFormService
            .publish(currentFormObject.id, object)
            .then((category) => {
                NotifService.info(`Document validé et publié`, 'valid');

                dispatch({
                    type: 'UPDATE_CURRENT_FORM_OBJECT',
                    payload: category,
                });
            });
    };

    useEffect(() => {
        setPublished(currentFormObject.status === 'published');
    }, [currentFormObject]);

    useEffect(() => {
        async function init() {
            await initDataStructureForm();
            setInitData(true);
        }

        if (!initData) {
            init();
        }
    }, [
        dispatch,
        formName,
        id,
        object,
        storeObjects,
        initDataStructureForm,
        initData,
    ]);

    useEffect(() => {
        const currentEditor = objCheck('createdBy', 'updatedBy')[
            !currentFormObject.updatedBy
        ]();

        if (!editor && !!currentEditor.username) {
            setEditor(`par ${currentEditor.username}`);
        }
    }, [currentFormObject.updatedBy, editor, objCheck]);

    useEffect(() => {
        const currentDate = objCheck('createdAt', 'updatedAt')[
            !!currentFormObject.updatedAt
        ]();

        if (!!currentDate && !dateInfo) {
            setDateInfo(`Dernière modification le ${currentDate}`);
        }
    }, [currentFormObject, currentFormObject.updatedAt, dateInfo, objCheck]);

    return (
        <Layout>
            <HeaderLayout
                highlight={`${dateInfo} ${editor}`}
                pageTitle={
                    published
                        ? `Modifier le document ${id}`
                        : `Initier un document ${id}`
                }
            />
            <SideNavigation items={ContribOfficialDocumentForm[0].form}>
                <ToolBox accordions>
                    {!published ? (
                        <FieldButton
                            dataTestId="validate-document"
                            disabled={published}
                            title="Valider le document"
                            onClick={publishObject}
                            colors={published ? [] : [white, green]}
                        />
                    ) : (
                        <LinkTo
                            text="voir la fiche"
                            href={`/object/officialDocument/${id}`}
                        />
                    )}
                </ToolBox>
                <CreateForm
                    jsonForm={ContribOfficialDocumentForm[0]}
                    color={blue}
                    objectFormType="officialDocument"
                />
            </SideNavigation>
        </Layout>
    );
}
