import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/GlobalState';
import CardInfo from '../../CardInfo';

export default function History({ section }) {
    const [history, setHistory] = useState([]);

    const {
        statePage: { accordionSections },
    } = useContext(AppContext);

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        const index = accordionSections.findIndex(
            (accordion) => accordion.section === section
        );

        // Check section is open before fetching data
        if (
            !history.length &&
            accordionSections[index] &&
            accordionSections[index].expanded
        ) {
            // Fetch Data
            setHistory([
                {
                    date: 'mai 2013',
                    event: 'date de création historique',
                },
                {
                    date: 'juin 2013',
                    event: 'date de création effective',
                },
                {
                    date: 'juin 2017',
                    event: 'date de fin',
                },
            ]);
        }
    }, [history, accordionSections]);

    return (
        <Container>
            <Row>
                <Col>History Structure {id}</Col>
                <Col n="12">
                    {history.map((h) => {
                        return (
                            <CardInfo
                                key={h.title}
                                link="/"
                                title={h.title}
                                date={h.date}
                            />
                        );
                    })}
                </Col>
            </Row>
        </Container>
    );
}
