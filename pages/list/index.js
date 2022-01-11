import dynamic from 'next/dynamic';
import grid from '../../helpers/imports';

const CardLink = dynamic(() => import('../../components/CardLink'));
const HeaderLayout = dynamic(() => import('../../components/HeaderLayout'));
const Layout = dynamic(() => import('../../components/Layout'));

export default function List() {
    const { Col, Row, Container } = grid();

    return (
        <Layout>
            <HeaderLayout pageTitle={`Listes qualifiées`} />
            <Container>
                <Row gutters>
                    <Col n="3">
                        <CardLink
                            link="/list/0"
                            supInfo="Liste qualifiée"
                            info="Liste 0"
                        />
                    </Col>
                    <Col n="3">
                        <CardLink
                            link="/list/1"
                            supInfo="Liste qualifiée"
                            info="Liste 1"
                        />
                    </Col>
                    <Col n="3">
                        <CardLink
                            link="/list/2"
                            supInfo="Liste qualifiée"
                            info="Liste 2"
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
