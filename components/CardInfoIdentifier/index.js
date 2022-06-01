import {
    Card,
    CardDetail,
    CardTitle,
    CardDescription,
    Icon,
} from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import { getTvaIntraFromSiren } from '../../helpers/tva-intra-from-siren';
import NavLink from '../NavLink';

import styles from './CardInfoIdentifier.module.scss';

export default function CardInfoIdentifier({
    link,
    supInfo,
    title,
    id,
    onClick,
}) {
    const { Col, Row, Container } = grid();
    const {
        stateList: { exportMode },
    } = useContext(AppContext);

    let siren = null;
    let tva = null;

    if (supInfo.toLowerCase() === 'siret') {
        siren = title.substr(0, 9);
        tva = getTvaIntraFromSiren(siren);
    }

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
                            {supInfo.toLowerCase() === 'siret' ? (
                                <CardDescription>
                                    <div>
                                        <Icon
                                            name="ri-arrow-right-line"
                                            size="lg"
                                        />
                                        Valeurs déduites
                                    </div>
                                    <div className={styles.DeductedFields}>
                                        <span className={styles.Title}>
                                            siren
                                        </span>
                                        <span className={styles.Value}>
                                            {siren}
                                        </span>
                                    </div>
                                    <div className={styles.DeductedFields}>
                                        <span className={styles.Title}>
                                            tva
                                        </span>
                                        <span className={styles.Value}>
                                            {tva}
                                        </span>
                                    </div>
                                </CardDescription>
                            ) : null}
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

CardInfoIdentifier.propTypes = {
    onClick: PropTypes.func.isRequired,
    supInfo: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
};
