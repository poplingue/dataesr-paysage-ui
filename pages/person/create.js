import { Icon } from '@dataesr/react-dsfr';
import CreatePerson from './create.json';
import Layout from '../../components/Layout';
import styles from '../../styles/Person.module.scss';
import CreateForm from '../../components/CreateForm';
import SideNavigation from '../../components/SideNavigation';

export default function Create() {
    return (
        <Layout>
            <div className={styles.test}>
                <Icon
                    name="ri-bubble-chart-line"
                    size="1x">
                    <h1>Create 1 Person</h1>
                </Icon>
                <SideNavigation items={CreatePerson[0].form}>
                    <CreateForm jsonForm={CreatePerson[0]}/>
                </SideNavigation>
            </div>
        </Layout>
    );
}
