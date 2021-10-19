import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import { getObjectType } from '../../../../helpers/constants';

export default function Object() {
    const router = useRouter();
    const { type, id } = router.query;

    return (
        <Layout pageTitle={type && getObjectType(type).title}>
            Object Type : {type}
            <br/>
            Structure : {id}
        </Layout>
    );
}
