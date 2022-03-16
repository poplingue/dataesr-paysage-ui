import { useRouter } from 'next/router';
import CardInfo from '../../components/CardInfo';
import grid from '../../helpers/imports';

export default function Identifiers() {
    const { Col, Row, Container } = grid();

    const {
        query: { id },
    } = useRouter();

    return (
        <>
            <Container fluid>
                <Row gutters spacing="px-2w pb-6w pt-2w">
                    <Col>
                        <CardInfo
                            link={`/contrib/person/${id}`}
                            supInfo="Wikipédia"
                            title="090909"
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
