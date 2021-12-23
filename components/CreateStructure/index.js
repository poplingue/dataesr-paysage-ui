import { useContext, useEffect } from 'react';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { AppContext } from '../../context/GlobalState';
import useCSSProperty from '../../hooks/useCSSProperty';
import CreateForm from '../Form';
import HeaderLayout from '../HeaderLayout';
import CreateStructureForm from './form.json';

export default function CreateStructure({ data }) {
    const { stateForm: state, dispatchForm: dispatch } = useContext(AppContext);
    const { style: yellow } = useCSSProperty(
        '--green-tilleul-verveine-main-707'
    );
    useEffect(() => {
        if (data && !state.departments.length) {
            dispatch({ type: 'UPDATE_DEPARTMENTS', payload: data });
        }
    });

    return (
        <Layout>
            <HeaderLayout pageTitle="Ajouter une structure" />
            <SideNavigation items={CreateStructureForm[0].form}>
                <CreateForm
                    jsonForm={CreateStructureForm[0]}
                    color={yellow}
                    objectFormType="structure"
                />
            </SideNavigation>
        </Layout>
    );
}
