import { useContext, useEffect } from 'react';
import CreateForm from '../../components/CreateForm';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { AppContext } from '../../context/GlobalState';
import CreateStructure from './create.json';

export default function Create({ data }) {
    const { state, dispatch } = useContext(AppContext);
    useEffect(() => {
        if (data && !state.departments.length) {
            dispatch({ type: 'UPDATE_DEPARTMENTS', payload: data });
        }
    });

    return (
        <Layout mainTitle="Create a structure">
            <div>
                <SideNavigation items={CreateStructure[0].form}>
                    <CreateForm jsonForm={CreateStructure[0]}/>
                </SideNavigation>
            </div>
        </Layout>
    );
}




