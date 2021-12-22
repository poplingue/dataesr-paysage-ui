import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { AppContext } from '../../context/GlobalState';
import useCSSProperty from '../../hooks/useCSSProperty';
import CreateForm from '../Form';
import HeaderLayout from '../HeaderLayout';
import LinkClick from '../LinkClick';
import CreatePersonForm from './form.json';

export default function CreatePerson({ data, id }) {
    const router = useRouter();
    const { dispatchForm: dispatch } = useContext(AppContext);
    const { style: pink } = useCSSProperty('--pink-tuile-main-556');

    const onClick = (e) => {
        e.preventDefault();
        Cookies.remove('updateObjectId');
        dispatch({
            type: 'UPDATE_UPDATE_OBJECT_ID',
            payload: { updateObjectId: '' },
        });

        router.push('/update/person');
    };

    return (
        <Layout>
            <HeaderLayout
                pageTitle={id ? `Modifier ${id}` : 'Ajouter une personne'}
            />
            <SideNavigation items={CreatePersonForm[0].form}>
                {id && (
                    <LinkClick
                        href="/update/person"
                        onClick={onClick}
                        text="Ajouter une nouvelle personne"
                    />
                )}
                <CreateForm
                    jsonForm={CreatePersonForm[0]}
                    color={pink}
                    objectFormType="person"
                />
            </SideNavigation>
        </Layout>
    );
}
