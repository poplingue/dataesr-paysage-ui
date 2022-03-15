import { Button, Select, TextInput } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { subObjects } from '../../config/objects';
import { getObjectTypeDetails } from '../../config/utils';
import grid from '../../helpers/imports';
import styles from './HomeSearch.module.scss';

export default function HomeSearch({}) {
    const { Col, Row, Container } = grid();
    const [typeObject, setTypeObject] = useState(0);
    const [searchValue, setSearchValue] = useState('');

    const router = useRouter();

    const onSearch = () => {
        if (!searchValue) {
            router.push(`/search/${typeObject}`).then;
        }
    };

    return (
        <Container fluid className={styles.HomeSearch}>
            <Row gutters spacing="p-3w" alignItems="bottom">
                <Col n="12 md-3">
                    <Select
                        onChange={(e) => {
                            setTypeObject(e.target.value);
                        }}
                        selected={typeObject}
                        label="Objet recherché"
                        options={[
                            ...Array(Object.keys(subObjects).length).keys(),
                        ].map((object, i) => {
                            return {
                                label: getObjectTypeDetails(i).title,
                                value: i,
                            };
                        })}
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
