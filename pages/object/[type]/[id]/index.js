import { useRouter } from 'next/router';
import Layout from '../../../../components/Layout';
import { getObjectType } from '../../../../helpers/constants';

// TODO to remove??
export default function Object() {
    const router = useRouter();
    const { type, id } = router.query;
    const title = getObjectType(type) ? getObjectType(type).title : type;
    const name = getObjectType(type) ? getObjectType(type).name : type;

    return (
        <Layout pageTitle={title}>
            Object Type : {name}
            <br/>
            Structure : {id}
        </Layout>
    );
}