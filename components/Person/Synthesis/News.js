import { useRouter } from 'next/router';
import dsfrGrid from '../../../helpers/imports';
import CardInfo from '../../CardInfo';
import LinkTo from '../../LinkTo';
import ShowMoreList from '../../ShowMoreList';

export default function News() {
    const { Col, Row, Container } = dsfrGrid();

    const {
        query: { id },
    } = useRouter();

    return (
        <Container fluid>
            <Row gutters spacing="px-2w pb-6w pt-2w">
                <ShowMoreList>
                    <Col n="4">
                        <CardInfo
                            externalLink="http://www.depeche.fr"
                            link="/update/person/1"
                            supInfo="du 01/01/2019 au 31/12/2022"
                            title="Dépêche #1"
                            subInfo="subInfo"
                        />
                    </Col>
                    <Col n="4">
                        <CardInfo
                            externalLink="http://www.depeche.fr"
                            link="/update/person/1"
                            supInfo="du 01/01/2019 au 31/12/2022"
                            title="Dépêche #2"
                            subInfo="subInfo"
                        />
                    </Col>
                    <Col n="4">
                        <CardInfo
                            externalLink="http://www.depeche.fr"
                            link="/update/person/1"
                            supInfo="du 01/01/2019 au 31/12/2022"
                            title="Dépêche #1"
                            subInfo="subInfo"
                        />
                    </Col>
                    <Col n="4">
                        <CardInfo
                            externalLink="http://www.depeche.fr"
                            link="/update/person/1"
                            supInfo="du 01/01/2019 au 31/12/2022"
                            title="Dépêche #2"
                            subInfo="subInfo"
                        />
                    </Col>
                    <Col n="4">
                        <CardInfo
                            externalLink="http://www.depeche.fr"
                            link="/update/person/1"
                            supInfo="du 01/01/2019 au 31/12/2022"
                            title="Dépêche #2"
                            subInfo="subInfo"
                        />
                    </Col>
                    <Col n="4">
                        <CardInfo
                            externalLink="http://www.depeche.fr"
                            link="/update/person/1"
                            supInfo="du 01/01/2019 au 31/12/2022"
                            title="Dépêche #2"
                            subInfo="subInfo"
                        />
                    </Col>
                </ShowMoreList>
            </Row>
            <Row gutters spacing="px-2w">
                <LinkTo
                    text="Voir toutes les dépêches"
                    href={`/object/person/${id}/news`}
                />
            </Row>
        </Container>
    );
}
