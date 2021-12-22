import { Col, Container, Row } from '@dataesr/react-dsfr';
import CardInfo from '../../../../components/CardInfo';
import HeaderLayout from '../../../../components/HeaderLayout';
import Layout from '../../../../components/Layout';

export default function PersonNews({ news }) {
    return (
        <Layout>
            <HeaderLayout pageTitle="Les Dépêches" />
            <Container>
                <Row gutters>
                    {news &&
                        news.map((personNews) => {
                            const { link, date, title, source } = personNews;

                            return (
                                <Col n="4" key={link}>
                                    <CardInfo
                                        externalLink={link}
                                        link="/update/person/1"
                                        date={date}
                                        title={title}
                                        source={source}
                                    />
                                </Col>
                            );
                        })}
                </Row>
            </Container>
        </Layout>
    );
}

export const getServerSideProps = () => ({
    props: {
        news: [
            {
                link: 'http://www.depeche.fr',
                date: 'du 01/01/2019 au 31/12/2022',
                title: 'Dépêche #1',
                source: 'source',
            },
            {
                link: 'http://www.depeche.fr',
                date: 'du 01/01/2019 au 31/12/2022',
                title: 'Dépêche #2',
                source: 'source',
            },
            {
                link: 'http://www.depeche.fr',
                date: 'du 01/01/2019 au 31/12/2022',
                title: 'Dépêche #3',
                source: 'source',
            },
            {
                link: 'http://www.depeche.fr',
                date: 'du 01/01/2019 au 31/12/2022',
                title: 'Dépêche #3',
                source: 'source',
            },
        ],
    },
});
