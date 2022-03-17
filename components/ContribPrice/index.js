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
import ContribPriceForm from './form.json';

export default function ContribPrice({ id }) {
    const {
        query: { object },
    } = useRouter();
    const { style: blue } = useCSSProperty(getObjectTypeDetails(object).color);

    const [editor, setEditor] = useState('');
    const [dateInfo, setDateInfo] = useState('');

    return (
        <Layout>
            <HeaderLayout
                highlight={`${dateInfo} ${editor}`}
                pageTitle={`Prix ${id}`}
            />
            <SideNavigation items={ContribPriceForm[0].form}>
                <ToolBox accordions>
                    <LinkTo text="voir la fiche" href={`/object/price/${id}`} />
                </ToolBox>
                <CreateForm
                    jsonForm={ContribPriceForm[0]}
                    color={blue}
                    objectFormType="price"
                />
            </SideNavigation>
        </Layout>
    );
}
