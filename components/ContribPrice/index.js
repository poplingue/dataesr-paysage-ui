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
import CreateForm from '../Form';
import HeaderLayout from '../HeaderLayout';
import LinkTo from '../LinkTo';
import ToolBox from '../ToolBox';
import ContribPriceForm from './form.json';

export default function ContribPrice({ id }) {
    const {
        stateForm: { storeObjects, currentObject },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const {
        pathname,
        query: { object },
    } = useRouter();
    const { style: blue } = useCSSProperty(getObjectTypeDetails(object).color);

    const formName = getFormName(pathname, object);
    const [initData, setInitData] = useState(false);
    const [editor, setEditor] = useState('');
    const [dateInfo, setDateInfo] = useState('');

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
            !currentObject.updatedBy
        ]();

        if (!editor && !!currentEditor.username) {
            setEditor(`par ${currentEditor.username}`);
        }
    }, [currentObject.updatedBy, editor]);

    useEffect(() => {
        const currentDate = objCheck('createdAt', 'updatedAt')[
            !!currentObject.updatedAt
        ]();

        if (!!currentDate && !dateInfo) {
            setDateInfo(`Dernière modification le ${currentDate}`);
        }
    }, [currentObject, currentObject.updatedAt, dateInfo]);

    return (
        <Layout>
            <HeaderLayout
                highlight={`${dateInfo} ${editor}`}
                pageTitle={
                    published
                        ? `Modifier le prix ${id}`
                        : `Initier un prix ${id}`
                }
            />
            <SideNavigation items={ContribPriceForm[0].form}>
                <ToolBox accordions>
                    <LinkTo text="voir la fiche" href={`/object/price/${id}`} />
                </ToolBox>
                <CreateForm
                    jsonForm={ContribPriceForm[0]}
                    color={blue}
                    objectFormType="price"
                />
            </SideNavigation>
        </Layout>
    );
}
