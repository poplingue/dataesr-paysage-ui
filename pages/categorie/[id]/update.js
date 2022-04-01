import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

const HeaderLayout = dynamic(() =>
    import('./../../../components/HeaderLayout')
);
const Layout = dynamic(() => import('./../../../components/Layout'));
const FormCategory = dynamic(() =>
    import('./../../../components/FormCategory')
);

export default function UpdateCategoryPage() {
    const router = useRouter();
    const categoryId = router.query.id;

    return (
        <Layout>
            <HeaderLayout pageTitle="Modification d'une catégorie" />

            <FormCategory categoryId={categoryId} />
        </Layout>
    );
}
