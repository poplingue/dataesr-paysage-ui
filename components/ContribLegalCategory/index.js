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
import ContribLegalCategoryForm from './form.json';

export default function ContribDocument({ id }) {
    const {
        query: { object },
    } = useRouter();

    const { color, colorClassName } = getObjectTypeDetails('', object);
    const { style: brown } = useCSSProperty(color);

    const [editor, setEditor] = useState('');
    const [dateInfo, setDateInfo] = useState('');

    return (
        <Layout>
            <HeaderLayout
                highlight={`${dateInfo} ${editor}`}
                pageTitle={`Catégorie légale ${id}`}
            />
            <SideNavigation
                items={ContribLegalCategoryForm[0].form}
                color={colorClassName}
            >
                <ToolBox accordions>
                    <LinkTo
                        text="voir la fiche"
                        href={`/object/legalCategory/${id}`}
                    />
                </ToolBox>
                <CreateForm
                    jsonForm={ContribLegalCategoryForm[0]}
                    color={brown}
                    objectFormType="term"
                />
            </SideNavigation>
        </Layout>
    );
}
