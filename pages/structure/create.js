import { Icon } from '@dataesr/react-dsfr';
import CreateStructure from './create.json';
import Layout from '../../components/Layout';
import CreateForm from '../../components/CreateForm';

export default function Create() {
    return (
        <Layout>
            <div>
                <Icon
                    name="ri-bubble-chart-line"
                    size="1x">
                    <h1>Create 1 Structure</h1>
                </Icon>
                <CreateForm jsonForm={CreateStructure[0]}/>
            </div>
        </Layout>
    );
}
