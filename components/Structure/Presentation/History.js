import { Button, Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context/GlobalState';
import { niceFullDate } from '../../../helpers/utils';
import useViewport from '../../../hooks/useViewport';
import ObjectService from '../../../services/Object.service';
import CardInfo from '../../CardInfo';
import IconButton from '../../IconButton';

export default function History({ section }) {
    const [history, setHistory] = useState([]);
    const [fullHistory, setFullHistory] = useState([]);

    const {
        query: { id, type },
    } = useRouter();
    const { mobile } = useViewport();
    const router = useRouter();

    const {
        statePage: {
            accordionItems,
            modalDetail: { content },
        },
        dispatchPage: dispatch,
    } = useContext(AppContext);

    useEffect(() => {
        const index = accordionItems.findIndex(
            (accordion) => accordion.section === section
        );

        async function getData() {
            return (
                (await ObjectService.getSubObjectData(type, id, 'names')) || []
            );
        }

        // Check section is open before fetching data
        if (
            !history.length &&
            accordionItems[index] &&
            accordionItems[index].expanded
        ) {
            if (!Object.keys(history).length) {
                getData().then(({ data }) => {
                    setHistory(data.slice(0, 2));
                    setFullHistory(data);
                });
            }
        }
    }, [history, accordionItems, section, type, id]);

    const renderList = () => {
        // TODO make component
        return (
            <Container fluid>
                {fullHistory.map((history) => {
                    return (
                        <Row key={history.id} gutters>
                            <Col n="12">
                                <CardInfo
                                    onClick={() => goTo(history.id)}
                                    subInfo={history.shortName}
                                    supInfo={niceFullDate(history.startDate)}
                                    title={history.officialName}
                                />
                            </Col>
                        </Row>
                    );
                })}
            </Container>
        );
    };

    const renderDetails = ({ usualName, startDate, shortName }) => {
        // TODO display template checking data
        return (
            <Container>
                <Row>
                    <Col>Nom usuel : {usualName}</Col>
                </Row>
                <Row>
                    <Col>Date de création : {niceFullDate(startDate)}</Col>
                </Row>
                <Row>
                    <Col>Nom court : {shortName}</Col>
                </Row>
            </Container>
        );
    };

    const goTo = (resourceId) => {
        dispatch({
            type: 'UPDATE_MODAL_DETAIL',
            payload: { open: false },
        });

        router.push(`/contrib/structure/${id}/${resourceId}`);
    };

    const buttonFooterModal = (resourceId) => {
        return (
            <Button
                styleAsLink
                onClick={() => goTo(resourceId)}
                title="modifier"
                icon="ri-arrow-right-line"
                iconPosition="right"
                size="sm"
            >
                modifier
            </Button>
        );
    };

    const onClickDetails = async (resourceId) => {
        const { startDate, endDate, shortName, usualName, officialName } =
            await ObjectService.getResource(type, id, 'names', resourceId);
        dispatch({
            type: 'UPDATE_MODAL_DETAIL',
            payload: {
                title: officialName,
                footer: buttonFooterModal(resourceId),
                content: renderDetails({
                    startDate,
                    usualName,
                    endDate,
                    officialName,
                    shortName,
                }),
            },
        });
    };

    const onClickList = async () => {
        dispatch({
            type: 'UPDATE_MODAL_DETAIL',
            payload: {
                title: 'Historique complet',
                content: renderList(),
            },
        });
    };

    return (
        <Container>
            <Row gutters={!mobile} alignItems="middle">
                {history.map((historyCard) => {
                    const { officialName, id, startDate } = historyCard;

                    // TODO this is not a Card
                    return (
                        <Col n="12 md-4" key={id}>
                            <CardInfo
                                onClick={() => onClickDetails(id)}
                                supInfo={startDate}
                                title={officialName}
                                icon="ri-eye-2-line"
                                actionLabel="Détails"
                            />
                        </Col>
                    );
                })}
                <Col n="4">
                    <IconButton
                        onClick={onClickList}
                        title={`Voir tout l'historique`}
                        icon="ri-eye-2-line"
                    />
                </Col>
            </Row>
        </Container>
    );
}
