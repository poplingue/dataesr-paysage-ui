import CreateForm from '../../components/CreateForm';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import CreatePerson from './create.json';
import styles from './Person.module.scss';

export default function Create() {
    return (
        <Layout mainTitle="Create a person">
            <div className={styles.test}>
                <SideNavigation items={CreatePerson[0].form}>
                    <CreateForm jsonForm={CreatePerson[0]}/>
                </SideNavigation>
            </div>
        </Layout>
    );
}
