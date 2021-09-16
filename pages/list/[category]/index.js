import { Col, Container, Icon, Row, Tile, TileBody, Toggle } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../../components/Layout';
import List from '../../../components/List';
import ListElement from '../../../components/ListElement';
import { getTitle } from '../../../helpers/constants';

export default function Category({ structures }) {
    const router = useRouter();
    const { category } = router.query;
    const [selection, setSelection] = useState([]);
    const [exportMode, setExportMode] = useState(false);
    const [elements, setElements] = useState(() => {
        return structures.map((structure, i) => {
            return { ...structure, checked: false, id: i };
        });
    });

    const onTileClick = (id) => {
        if (!exportMode) {
            router.push(`/list/${category}/${id}`);
        } else {
            const newList = elements.map((elm) => {
                return { ...elm, checked: id === elm.id ? !elm.checked : elm.checked };
            });
            setElements(newList);
            setSelection(newList.filter((l) => l.checked));
        }
    };

    return (
        <Layout pageTitle={`Liste catégorie : ${category}`}>
            <Container fluid>
                <Row>
                    <Col n="12">
                        <Toggle
                            onChange={() => setExportMode(!exportMode)}
                            checked={exportMode}
                            label="Mode export"
                            description="Exporter votre liste personnalisée"
                        />
                    </Col>
                    <Col n="8">
                        <List>
                            {elements.map((structure, i) => {
                                return <ListElement key={i} className="mx-10">
                                    <Tile
                                        className="w-100"
                                        horizontal
                                        onClick={() => onTileClick(structure.id)}
                                    >
                                        <TileBody
                                            title={structure.name}
                                            description={structure.desc}>
                                            <Container fluid className="w-100">
                                                <Row alignItems="top">
                                                    <Col n={exportMode ? '11' : '12'}>
                                                        <div>Lorem ipsum dolor sit amet, consectetur adipisicing
                                                            elit.
                                                        </div>
                                                    </Col>
                                                    {exportMode && <Col n="1">
                                                        {structure.checked ?
                                                            <Icon name="ri-checkbox-line" size="2x"/> :
                                                            <Icon name="ri-checkbox-blank-line" size="2x"/>}
                                                    </Col>}
                                                </Row>
                                            </Container>
                                        </TileBody>
                                    </Tile>
                                </ListElement>;
                            })}
                        </List>
                    </Col>
                    <Col n="4">
                        <List>
                            {selection.map((s) => {
                                return <ListElement key={s.id}>
                                    {s.name}
                                </ListElement>;
                            })}
                        </List>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}

export async function getServerSideProps() {
    return {
        props: {
            structures: [
                {
                    'id': 0,
                    'name': 'Structure 0',
                    'desc': 'Description',
                },
                {
                    'id': 1,
                    'name': 'Structure 1',
                    'desc': 'Description'
                },
                {
                    'id': 2,
                    'name': 'Structure 2',
                    'desc': 'Description'
                },
                {
                    'id': 3,
                    'name': 'Structure 3',
                    'desc': 'Description'
                }
            ]
        }
    };
}

