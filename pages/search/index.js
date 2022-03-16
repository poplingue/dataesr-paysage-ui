import dynamic from 'next/dynamic';
import HomeSearch from '../../components/HomeSearch';
import grid from '../../helpers/imports';

const HeaderLayout = dynamic(() => import('../../components/HeaderLayout'));
const CardLink = dynamic(() => import('../../components/CardLink'));
const Layout = dynamic(() => import('../../components/Layout'));

export default function Search() {
    const { Col, Row, Container } = grid();

    return (
        <Layout>
            <HeaderLayout pageTitle="Recherche" />
            <Container fluid>
                <Row>
                    <Col spacing="mb-5w">
                        <HomeSearch defaultType="" switchPage />
                    </Col>
                </Row>
                <Row>
                    <Container>
                        <Row>
                            <Col>...Filtres</Col>
                        </Row>
                        <Row>
                            <Col>...Résultat de recherche</Col>
                        </Row>
                    </Container>
                </Row>
            </Container>
        </Layout>
    );
}
