import { useContext, useEffect, useRef, useState } from 'react';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { AppContext } from '../../context/GlobalState';
import useCSSProperty from '../../hooks/useCSSProperty';
import { dataFormService } from '../../services/DataForm.service';
import CreateForm from '../Form';
import HeaderLayout from '../HeaderLayout';
import UpdateStructureForm from './form.json';

export default function UpdateStructure({ data, id }) {
    const { stateForm: state, dispatchForm: dispatch } = useContext(AppContext);
    const { style: yellow } = useCSSProperty(
        '--green-tilleul-verveine-main-707'
    );
    const [structureForm, setStructureForm] = useState(UpdateStructureForm[0]);
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

            if (message.data.length > 0) {
                const a = dataFormService.mapping(
                    UpdateStructureForm[0],
                    message.data[message.data.length - 1]
                );
                // setStructureForm(a);
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
