import {
    Card,
    CardDescription,
    CardDetail,
    CardTitle,
    Col,
    Container,
    Icon,
    Row,
    Tag,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import NavLink from '../NavLink';
import styles from './CardInfo.module.scss';

export default function CardInfo({
    link,
    date,
    title,
    source,
    externalLink,
    id,
}) {
    return (
        <Container fluid>
            <Row>
                <Col spacing="py-1w">
                    <div className="p-relative">
                        <Card
                            asLink={<NavLink id={id} href={link} />}
                            hasArrow={false}
                        >
                            <CardDetail>{date}</CardDetail>
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>{source}</CardDescription>
                        </Card>
                        <div className={`fs-12-12 ${styles.LinkLabel}`}>
                            <Icon
                                name="ri-arrow-right-line"
                                size="lg"
                                as="span"
                                iconPosition="right"
                            >
                                Modifier
                            </Icon>
                        </div>
                    </div>
                </Col>
                {externalLink && (
                    <Col n="12">
                        <Tag
                            href={externalLink}
                            icon="ri-external-link-line"
                            colorFamily="blue-cumulus"
                        >
                            Voir
                        </Tag>
                    </Col>
                )}
            </Row>
        </Container>
    );
}

CardInfo.defaultProps = {
    externalLink: '',
    source: '',
};

CardInfo.propTypes = {
    link: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    source: PropTypes.string,
    externalLink: PropTypes.string,
};