import { Col, Container, Row } from '@dataesr/react-dsfr';
import { goToSection, sectionUniqueId } from '../../../helpers/utils';
import CardInfo from '../../CardInfo';
import IconButton from '../../IconButton';
import ShowMoreList from '../../ShowMoreList';

export default function News() {
    return (
        <>
            <Container fluid>
                <Row gutters spacing="px-2w pb-6w pt-2w">
                    <ShowMoreList>
                        <Col n="4">
                            <CardInfo
                                externalLink="http://www.depeche.fr"
                                link="/update/person/1"
                                date="du 01/01/2019 au 31/12/2022"
                                title="Dépêche #1"
                                source="source"
                            />
                        </Col>
                        <Col n="4">
                            <CardInfo
                                externalLink="http://www.depeche.fr"
                                link="/update/person/1"
                                date="du 01/01/2019 au 31/12/2022"
                                title="Dépêche #2"
                                source="source"
                            />
                        </Col>
                        <Col n="4">
                            <CardInfo
                                externalLink="http://www.depeche.fr"
                                link="/update/person/1"
                                date="du 01/01/2019 au 31/12/2022"
                                title="Dépêche #1"
                                source="source"
                            />
                        </Col>
                        <Col n="4">
                            <CardInfo
                                externalLink="http://www.depeche.fr"
                                link="/update/person/1"
                                date="du 01/01/2019 au 31/12/2022"
                                title="Dépêche #2"
                                source="source"
                            />
                        </Col>
                        <Col n="4">
                            <CardInfo
                                externalLink="http://www.depeche.fr"
                                link="/update/person/1"
                                date="du 01/01/2019 au 31/12/2022"
                                title="Dépêche #2"
                                source="source"
                            />
                        </Col>
                        <Col n="4">
                            <CardInfo
                                externalLink="http://www.depeche.fr"
                                link="/update/person/1"
                                date="du 01/01/2019 au 31/12/2022"
                                title="Dépêche #2"
                                source="source"
                            />
                        </Col>
                    </ShowMoreList>
                </Row>
                <Row gutters spacing="px-2w">
                    <IconButton
                        size="medium"
                        square={false}
                        onClick={(e) =>
                            goToSection(
                                e,
                                sectionUniqueId('Présence sur le web')
                            )
                        }
                        title="Accéder à toutes les dépêches"
                        icon="ri-arrow-down-line"
                    />
                </Row>
            </Container>
        </>
    );
}
