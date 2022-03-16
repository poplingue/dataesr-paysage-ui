import { Button, Select, TextInput } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { subObjects } from '../../config/objects';
import { getObjectTypeDetails } from '../../config/utils';
import { AppContext } from '../../context/GlobalState';
import grid from '../../helpers/imports';
import useViewport from '../../hooks/useViewport';
import styles from './HomeSearch.module.scss';

export default function HomeSearch({ switchPage, defaultType }) {
    const { Col, Row, Container } = grid();
    const [typeObject, setTypeObject] = useState(defaultType || '');
    const [searchValue, setSearchValue] = useState('');
    const options = [...Array(Object.keys(subObjects).length).keys()].map(
        (object, i) => {
            return {
                label: getObjectTypeDetails(i).title,
                value: i.toString(),
            };
        }
    );
    const {
        statePage: { user },
    } = useContext(AppContext);

    const noUser = !Object.keys(user).length;

    const router = useRouter();
    const { mobile } = useViewport();

    const onSearch = () => {
        if (!searchValue) {
            router.push(`/search/${typeObject}`);
        }
    };

    const changeType = (e) => {
        if (switchPage) {
            router.push(`/search/${e.target.value}`);
        } else {
            setTypeObject(e.target.value);
        }
    };

    return (
        <Container fluid={mobile} className={styles.HomeSearch}>
            <Row gutters spacing="p-3w" alignItems="bottom">
                <Col n="12 md-3">
                    <Select
                        onChange={changeType}
                        selected={typeObject}
                        label="Objet recherché"
                        options={[
                            { value: '', label: 'Tout objet', disabled: true },
                            ...options,
                        ]}
                    />
                </Col>
                <Col n="12 md-7">
                    <TextInput
                        disabled
                        label="Rechercher"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </Col>
                <Col n="12 md-2">
                    <Button
                        disabled={noUser}
                        icon="ri-search-2-line"
                        title="Rechercher"
                        onClick={onSearch}
                    >
                        Rechercher
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}
