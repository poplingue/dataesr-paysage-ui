import dynamic from 'next/dynamic';
import grid from '../../../../helpers/imports';

const HeaderLayout = dynamic(() =>
    import('../../../../components/HeaderLayout')
);
const CardInfo = dynamic(() => import('../../../../components/CardInfo'));
const Layout = dynamic(() => import('../../../../components/Layout'));

export default function PersonNews({ news }) {
    const { Col, Row, Container } = grid();

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
                                        link="/contrib/person/1"
                                        supInfo={date}
                                        title={title}
                                        subInfo={source}
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
