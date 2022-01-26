import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { AppContext } from '../../context/GlobalState';
import { getFormName } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import DBService from '../../services/DB.service';
import CreateForm from '../Form';
import HeaderLayout from '../HeaderLayout';
import UpdateStructureForm from './form.json';

export default function UpdateStructure({ data, id }) {
    const {
        stateForm: { departments, storeObjects },
        dispatchForm: dispatch,
    } = useContext(AppContext);
    const { style: yellow } = useCSSProperty(
        '--green-tilleul-verveine-main-707'
    );
    const [structureForm, setStructureForm] = useState(UpdateStructureForm[0]);
    const workerRef = useRef();

    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);

    useEffect(() => {
        if (data && !departments.length) {
            dispatch({ type: 'UPDATE_DEPARTMENTS', payload: data });
        }
    });

    useEffect(() => {
        workerRef.current = new Worker('/sw.js', {
            name: 'Get_object',
            type: 'module',
        });
    }, []);

    useEffect(() => {
        workerRef.current.onmessage = async ({ data }) => {
            const message = JSON.parse(data);

            if (message.data && message.status >= 200 && message.status < 400) {
                const newForm = dataFormService.mapping(
                    UpdateStructureForm[0],
                    message.data
                );

                setStructureForm(newForm);

                const fields = dataFormService.infiniteFields(
                    message.data,
                    formName
                );

                dispatch({
                    type: 'UPDATE_FORM_FIELD_LIST',
                    payload: {
                        formName,
                        fields,
                    },
                });

                const checkStoreObject = storeObjects.indexOf(formName) > -1;

                if (checkStoreObject) {
                    // indexDB
                    console.log('==== fields ==== ', fields, formName);
                    await DBService.setList(fields, formName);
                }
            }
        };
    }, [dispatch, formName, storeObjects]);

    useEffect(() => {
        async function fetchStructure() {
            workerRef.current.postMessage({
                object: 'structure',
                id,
            });
        }

        if (id) {
            fetchStructure();
        }
    }, [id]);

    return (
        <Layout>
            <HeaderLayout
                highlight={id ? 'Dernière modification le 23/03/2021' : ''}
                pageTitle={id ? `Modifier ${id}` : 'Ajouter une structure'}
            />
            <SideNavigation items={UpdateStructureForm[0].form}>
                <CreateForm
                    jsonForm={id ? structureForm : UpdateStructureForm[0]}
                    color={yellow}
                    objectFormType="structure"
                />
            </SideNavigation>
        </Layout>
    );
}
