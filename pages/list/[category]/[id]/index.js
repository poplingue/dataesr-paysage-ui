import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';

export default function Structure() {
    const router = useRouter();
    const { category, id } = router.query;

    return (
        <Layout pageTitle="Structure">
            Category : {category}
            <br/>
            Structure : {id}
        </Layout>
    );
}
