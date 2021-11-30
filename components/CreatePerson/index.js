import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import useCSSProperty from '../../hooks/useCSSProperty';
import CreateForm from '../Form';
import HeaderLayout from '../HeaderLayout';
import CreatePerson from './form.json';

export default function Create() {
    const { style: pink } = useCSSProperty('--pink-tuile-main-556');

    return (
        <Layout>
            <HeaderLayout pageTitle="Ajouter une personne" />
            <SideNavigation items={CreatePerson[0].form}>
                <CreateForm
                    jsonForm={CreatePerson[0]}
                    color={pink}
                    objectFormType="person"
                />
            </SideNavigation>
        </Layout>
    );
}
