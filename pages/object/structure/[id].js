import { Accordion, AccordionItem } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import BigButton from '../../../components/BigButton';
import HeaderLayout from '../../../components/HeaderLayout';
import Layout from '../../../components/Layout';

export default function Object() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Layout>
            <HeaderLayout pageTitle="Une Structure"/>
            Structure : {id}
            <Accordion>
                <AccordionItem title="">
                    item
                </AccordionItem>
            </Accordion>
            <BigButton
                square={false}
                onClick={() => {
                }}
                color="#f55"
                title="Ajouter un nouvel Établissement"
                icon="ri-add-circle-line"
            >
            </BigButton>
        </Layout>
    );
}
