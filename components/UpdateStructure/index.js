import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { AppContext } from '../../context/GlobalState';
import { getFormName } from '../../helpers/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
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
    const workerRef = useRef();

    const {
        pathname,
        query: { object },
    } = useRouter();
    const formName = getFormName(pathname, object);
    const [initData, setInitData] = useState(false);

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
            console.log('==== onmessage ==== ', JSON.parse(data));
        };
    });

    // const filterByUnSaved = (fields) => {
    //     return fields.filter((field) => {
    //         return !field.unSaved === true;
    //     });
    // };

    const initDataStructureForm = useCallback(async () => {
        dataFormService
            .initFormSections(object, id, formName, storeObjects)
            .then((fields) => {
                // Update fields in state
                dispatch({
                    type: 'UPDATE_FORM_FIELD_LIST',
                    payload: {
                        formName,
                        fields,
                    },
                });
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
        async function fetchStructure() {
            workerRef.current.postMessage({
                object,
                id,
            });
        }

        if (id) {
            fetchStructure();
        }
    }, [id, object]);

    return (
        <Layout>
            <HeaderLayout
                highlight={id ? 'Dernière modification le 23/03/2021' : ''}
                pageTitle={id ? `Modifier ${id}` : 'Ajouter une structure'}
            />
            <SideNavigation items={UpdateStructureForm[0].form}>
                <CreateForm
                    jsonForm={UpdateStructureForm[0]}
                    color={yellow}
                    objectFormType="structure"
                />
            </SideNavigation>
        </Layout>
    );
}
