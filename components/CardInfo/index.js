import {
    Card,
    CardDescription,
    CardDetail,
    CardTitle,
    Icon,
    Tag,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { noPrintClass } from '../../helpers/utils';
import NavLink from '../NavLink';
import styles from './CardInfo.module.scss';

export default function CardInfo({
    link,
    supInfo,
    title,
    subInfo,
    externalLink,
    id,
    icon,
    checked,
    onClick,
    actionLabel,
}) {
    const { Col, Row, Container } = grid();
    const iconCheck = checked ? 'ri-checkbox-line' : 'ri-checkbox-blank-line';
    const {
        stateList: { exportMode },
    } = useContext(AppContext);

    return (
        <Container fluid>
            <Row>
                <Col spacing="py-1w">
                    <div className="p-relative">
                        <Card
                            onClick={() => {
                                onClick(id);
                            }}
                            href={onClick ? '#' : link}
                            asLink={
                                onClick ? undefined : (
                                    <NavLink id={id} href={link} />
                                )
                            }
                            hasArrow={false}
                        >
                            <CardDetail>{supInfo}</CardDetail>
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>{subInfo}</CardDescription>
                        </Card>
                        <div
                            className={`fs-12-12 ${styles.LinkLabel} ${noPrintClass}`}
                        >
                            <Icon
                                name={exportMode ? iconCheck : icon}
                                size="lg"
                                as="span"
                                iconPosition="right"
                            >
                                {actionLabel}
                            </Icon>
                        </div>
                    </div>
                </Col>
                {externalLink && (
                    <Col n="12">
                        <Tag href={externalLink} icon="ri-external-link-line">
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
    subInfo: '',
    actionLabel: 'Modifier',
    link: undefined,
    onClick: () => {},
    icon: 'ri-arrow-right-line',
};

CardInfo.propTypes = {
    link: PropTypes.string,
    actionLabel: PropTypes.string,
    onClick: PropTypes.func,
    supInfo: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    subInfo: PropTypes.string,
    icon: PropTypes.string,
    externalLink: PropTypes.string,
};
