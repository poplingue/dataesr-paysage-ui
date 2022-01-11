import dynamic from 'next/dynamic';
import grid from '../../helpers/imports';

const HeaderLayout = dynamic(() => import('../../components/HeaderLayout'));
const CardLink = dynamic(() => import('../../components/CardLink'));
const Layout = dynamic(() => import('../../components/Layout'));

export default function Search() {
    const { Col, Row, Container } = grid();

    return (
        <Layout>
            <HeaderLayout pageTitle="Recherche" />
            <Container>
                <Row>
                    <Col>
                        <CardLink
                            link={`/object/person/8`}
                            info="Une personne"
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
