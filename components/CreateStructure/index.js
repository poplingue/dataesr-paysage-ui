import { useContext, useEffect } from 'react';
import CreateForm from '../../components/CreateForm';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { AppContext } from '../../context/GlobalState';
import useCSSProperty from '../../hooks/useCSSProperty';
import CreateStructure from './form.json';

export default function Create({ data }) {
    const { stateForm: state, dispatchForm: dispatch } = useContext(AppContext);
    const { style: yellow } = useCSSProperty('--yellow-dark-700');
    useEffect(() => {
        if (data && !state.departments.length) {
            dispatch({ type: 'UPDATE_DEPARTMENTS', payload: data });
        }
    });

    return (
        <Layout pageTitle="Create a structure">
            <SideNavigation items={CreateStructure[0].form}>
                <CreateForm jsonForm={CreateStructure[0]} color={yellow} />
            </SideNavigation>
        </Layout>
    );
}
