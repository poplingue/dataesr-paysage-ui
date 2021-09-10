import { Col, Container, Icon, Row, Tile, TileBody } from '@dataesr/react-dsfr';
import { useState } from 'react';
import Layout from '../../components/Layout';
import List from '../../components/List';
import ListElement from '../../components/ListElement';

export default function National({ structures }) {
    const [selection, setSelection] = useState([]);
    const [elements, setElements] = useState(() => {
        return structures.map((structure, i) => {
            return { ...structure, checked: false, id: i };
        });
    });

    const onTileClick = (id) => {
        const newList = elements.map((elm) => {
            return { ...elm, checked: id === elm.id ? !elm.checked : elm.checked };
        });
        setElements(newList);
        setSelection(newList.filter((l) => l.checked));
    };

    return (
        <Layout>
            <Container>
                <Row>
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
                                                    <Col n="11">
                                                        <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                                                        </div>
                                                    </Col>
                                                    <Col n="1">
                                                        {structure.checked ? <Icon name="ri-checkbox-line" size="2x"/> :
                                                            <Icon name="ri-checkbox-blank-line" size="2x"/>}
                                                    </Col>
                                                </Row>
                                            </Container>
                                        </TileBody>
                                    </Tile>
                                </ListElement>;
                            })}
                        </List>
                    </Col>
                    <Col n='4'>
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
                    'name': 'Structure A',
                    'desc': 'Description',
                },
                {
                    'name': 'Structure Z',
                    'desc': 'Description'
                },
                {
                    'name': 'Structure E',
                    'desc': 'Description'
                },
                {
                    'name': 'Structure R',
                    'desc': 'Description'
                }
            ]
        }
    };
}

