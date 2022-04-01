import dynamic from 'next/dynamic';

const HeaderLayout = dynamic(() =>
    import('./../../../components/HeaderLayout')
);
const Layout = dynamic(() => import('./../../../components/Layout'));
const FormCategory = dynamic(() =>
    import('./../../../components/FormCategory')
);

export default function AddCategoryPage() {
    return (
        <Layout>
            <HeaderLayout pageTitle="Ajout d'une nouvelle catégorie" />

            <FormCategory />
        </Layout>
    );
}
