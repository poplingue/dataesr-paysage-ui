import CreatePerson from './create.json';
import Layout from '../../components/Layout';
import styles from '../../styles/Person.module.scss';
import CreateForm from '../../components/CreateForm';
import SideNavigation from '../../components/SideNavigation';

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
