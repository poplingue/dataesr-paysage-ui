import {Container, Col, Row} from '@dataesr/react-dsfr'
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import ExportList from '../../../components/ExportList';
import HeaderLayout from '../../../components/HeaderLayout';
import Layout from '../../../components/Layout';
import List from '../../../components/List';
import TileElement from '../../../components/TileElement';
import { AppContext } from '../../../context/GlobalState';
import useCSSProperty from '../../../hooks/useCSSProperty';

export default function Category({ structures }) {
    const { style: yellow } = useCSSProperty('--yellow-dark-700');
    const router = useRouter();
    const { stateList: { exportMode } } = useContext(AppContext);
    const { category } = router.query;
    const [selection, setSelection] = useState([]);
    const [elements, setElements] = useState(() => {
        return structures.map((structure, i) => {
            return { ...structure, checked: false };
        });
    });

    const onTileClick = (id) => {
        if (!exportMode) {
            router.push(`/object/${category}/${id}`);
        } else {
            const newList = elements.map((elm) => {
                return { ...elm, checked: id === elm.id ? !elm.checked : elm.checked };
            });
            setElements(newList);
            setSelection(newList.filter((l) => l.checked));
        }
    };

    return (
        <Layout>
            <HeaderLayout pageTitle={`Liste catégorie : ${category}`}/>
            <Container>
                <Row>
                    <Col>
                        <ExportList selection={selection}>
                            <List>
                                {elements.map((structure, i) => {
                                    return <li key={structure.name}>
                                        <TileElement
                                            defaultIcon="ri-arrow-right-line"
                                            color={yellow}
                                            checked={structure.checked}
                                            title={structure.name}
                                            subTitle="subTitle"
                                            body={structure.desc}
                                            onClick={onTileClick}
                                            id={structure.id}>
                                        </TileElement>
                                    </li>;
                                })}
                            </List>
                        </ExportList>
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

