import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../components/Layout';
import SideNavigation from '../../components/SideNavigation';
import { getObjectTypeDetails } from '../../config/utils';
import useCSSProperty from '../../hooks/useCSSProperty';
import CreateForm from '../Form';
import HeaderLayout from '../HeaderLayout';
import LinkTo from '../LinkTo';
import ToolBox from '../ToolBox';
import ContribDocumentForm from './form.json';

export default function ContribDocument({ id }) {
    const {
        query: { object },
    } = useRouter();

    const { style: purple } = useCSSProperty(
        getObjectTypeDetails('', object).color
    );

    const [editor, setEditor] = useState('');
    const [dateInfo, setDateInfo] = useState('');

    return (
        <Layout>
            <HeaderLayout
                highlight={`${dateInfo} ${editor}`}
                pageTitle={`Terme ${id}`}
            />
            <SideNavigation
                items={ContribDocumentForm[0].form}
                color={getObjectTypeDetails('', object).colorClassName}
            >
                <ToolBox accordions>
                    <LinkTo text="voir la fiche" href={`/object/term/${id}`} />
                </ToolBox>
                <CreateForm
                    jsonForm={ContribDocumentForm[0]}
                    color={purple}
                    objectFormType="term"
                />
            </SideNavigation>
        </Layout>
    );
}
