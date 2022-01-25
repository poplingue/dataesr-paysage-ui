import { useContext, useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { AppContext } from '../../context/GlobalState';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import CreateForm from '../Form';
import HeaderLayout from '../HeaderLayout';
import DemoUpdateStructureForm from './demoForm.json';

export default function UpdateStructure({ data, id }) {
    const { stateForm: state, dispatchForm: dispatch } = useContext(AppContext);
    const { style: yellow } = useCSSProperty(
        '--green-tilleul-verveine-main-707'
    );
    const [structureForm, setStructureForm] = useState(
        DemoUpdateStructureForm[0]
    );
    const workerRef = useRef();

    useEffect(() => {
        if (data && !state.departments.length) {
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
        workerRef.current.onmessage = ({ data }) => {
            const message = JSON.parse(data);

            if (message.data && message.status >= 200 && message.status < 400) {
                const newForm = dataFormService.mapping(
                    DemoUpdateStructureForm[0],
                    message.data
                );
                console.log('==== newForm ==== ', newForm.form[0]);
                setStructureForm(newForm);
            }
        };
    }, []);

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
            <SideNavigation items={DemoUpdateStructureForm[0].form}>
                <CreateForm
                    jsonForm={id ? structureForm : DemoUpdateStructureForm[0]}
                    color={yellow}
                    objectFormType="structure"
                />
            </SideNavigation>
        </Layout>
    );
}
