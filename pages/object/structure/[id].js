import { Accordion, AccordionItem } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';

export default function Object() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <Layout pageTitle='Structure'>
            Structure : {id}
            <Accordion>
                <AccordionItem title="">
                    item
                </AccordionItem>
            </Accordion>
        </Layout>
    );
}
