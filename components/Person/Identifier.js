import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import CardInfo from '../../components/CardInfo';

export default function Identifiers() {
    const {
        query: { id },
    } = useRouter();

    return (
        <>
            <Container fluid>
                <Row gutters spacing="px-2w pb-6w pt-2w">
                    <Col>
                        <CardInfo
                            link={`/update/person/${id}`}
                            date="Wikipédia"
                            title="090909"
                        />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
