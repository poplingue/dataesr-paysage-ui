import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { AppContext } from '../../context/GlobalState';
import { getFormName } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import DBService from '../../services/DB.service';
import NotifService from '../../services/Notif.service';
import FieldButton from '../FieldButton';
import CreateForm from '../Form';
import HeaderLayout from '../HeaderLayout';
import ToolBox from '../ToolBox';
import UpdateStructureForm from './form.json';

export default function UpdateStructure({ data, id }) {
    const {
        stateForm: { departments, storeObjects, currentObject },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const { style: yellow } = useCSSProperty(
        '--green-tilleul-verveine-main-707'
    );
    const { style: green } = useCSSProperty('--success-main-525');
    const { style: white } = useCSSProperty('--grey-1000');
    const {
        pathname,
        query: { object },
    } = useRouter();

    const objTest = useCallback(
        (keyA, keyB) => {
            return {
                false: () => currentObject[keyA] || '',
                true: () => currentObject[keyB] || '',
            };
        },
        [currentObject]
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

    const publish = () => {
        dataFormService.publish(currentObject.id, object).then((structure) => {
            NotifService.info(`Structure validée et publiée`, 'valid');

            dispatch({ type: 'UPDATE_CURRENT_OBJECT', payload: structure });
        });
    };

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
        const currentEditor = objTest('createdBy', 'updatedBy')[
            !currentObject.updatedBy
        ]();

        if (!editor && !!currentEditor) {
            setEditor(`par ${currentEditor.username}`);
        }
    }, [currentObject.updatedBy, editor, objTest]);

    useEffect(() => {
        const currentDate = objTest('createdAt', 'updatedAt')[
            !!currentObject.updatedAt
        ]();

        if (!!currentDate && !dateInfo) {
            setDateInfo(`Dernière modification le ${currentDate}`);
        }
    }, [currentObject.updatedAt, dateInfo, objTest]);

    return (
        <Layout>
            <HeaderLayout
                highlight={`${dateInfo} ${editor}`}
                pageTitle={
                    currentObject.status === 'published'
                        ? `Modifier la structure ${id}`
                        : `Initier une structure ${id}`
                }
            />
            <SideNavigation items={UpdateStructureForm[0].form}>
                <ToolBox accordions>
                    <FieldButton
                        dataTestId="validate-structure"
                        disabled={currentObject.status === 'published'}
                        title="Valider la structure"
                        onClick={publish}
                        colors={
                            currentObject.status === 'published'
                                ? []
                                : [white, green]
                        }
                    />
                </ToolBox>
                <CreateForm
                    jsonForm={UpdateStructureForm[0]}
                    color={yellow}
                    objectFormType="structure"
                />
            </SideNavigation>
        </Layout>
    );
}
