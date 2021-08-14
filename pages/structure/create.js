import { Icon } from '@dataesr/react-dsfr';
import CreateStructure from './create.json';
import Layout from '../../components/Layout';
import CreateForm from '../../components/CreateForm';
import { useEffect } from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import SideNavigation from '../../components/SideNavigation';

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
                <Icon
                    name="ri-bubble-chart-line"
                    size="1x">
                    <h1>Create 1 Structure</h1>
                </Icon>
                <SideNavigation items={CreateStructure[0].form}>
                    <CreateForm jsonForm={CreateStructure[0]}/>
                </SideNavigation>
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    const res = await fetch(`https://geo.api.gouv.fr/departements?fields=nom,code,codeRegion`);
    const data = await res.json();

    if (!data) {
        return { notFound: true };
    }
    return { props: { data } };
}
