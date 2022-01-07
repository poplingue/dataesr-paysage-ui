import {
    Card,
    CardDetail,
    CardTitle,
    Col,
    Container,
    Row,
} from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/GlobalState';
import IconButton from '../../IconButton';

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
    }, [history, accordionSections, section]);

    const onClick = () => {
        console.log('==== LOG ==== ');
    };

    return (
        <Container>
            <Row gutters>
                <Col n="12">History Structure {id}</Col>

                {history.slice(0, 4).map((historyCard) => {
                    const { date, event } = historyCard;

                    return (
                        <Col n="4" key={event}>
                            <Card onClick={onClick} href="#">
                                <CardDetail>{event}</CardDetail>
                                <CardTitle>{date}</CardTitle>
                            </Card>
                        </Col>
                    );
                })}
                <Col n="4">
                    <IconButton
                        onClick={() => {}}
                        title={`Voir tout l'historique`}
                        icon="ri-eye-2-line"
                    />
                </Col>
            </Row>
        </Container>
    );
}
