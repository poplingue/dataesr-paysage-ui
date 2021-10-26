import Layout from '../../components/Layout'
import LinkTo from '../../components/LinkTo'

export default function Create() {
    return (
        <Layout>
            <LinkTo
                text="Créer un nouvel Établissement"
                href="/create/structure"
            />
        </Layout>
    )
}
