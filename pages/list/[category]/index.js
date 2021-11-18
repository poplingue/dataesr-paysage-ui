import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import ExportList from '../../../components/ExportList';
import HeaderLayout from '../../../components/HeaderLayout';
import Layout from '../../../components/Layout';
import List from '../../../components/List';
import TileElement from '../../../components/TileElement';
import { AppContext } from '../../../context/GlobalState';
import { getObjectType } from '../../../helpers/constants';
import useCSSProperty from '../../../hooks/useCSSProperty';

export default function Category(props) {
    const router = useRouter();
    const {
        stateList: { exportMode },
    } = useContext(AppContext);
    const { category } = router.query;
    const { style: color } = useCSSProperty(getObjectType(category).color);
    const [selection, setSelection] = useState([]);

    const [elements, setElements] = useState(() => {
        const items = props[getObjectType(category).name] || [];

        return items.map((structure, i) => {
            return { ...structure, checked: false };
        });
    });

    const onTileClick = (id) => {
        if (!exportMode) {
            router.push(`/object/${getObjectType(category).name}/${id}`);
        } else {
            const newList = elements.map((elm) => {
                return {
                    ...elm,
                    checked: id === elm.id ? !elm.checked : elm.checked,
                };
            });
            setElements(newList);
            setSelection(newList.filter((l) => l.checked));
        }
    };

    return (
        <Layout>
            <HeaderLayout
                pageTitle={`Liste catégorie : ${getObjectType(category).title}`}
            />
            <Container>
                <Row>
                    <Col>
                        <ExportList selection={selection}>
                            <List>
                                {elements.map((structure, i) => {
                                    const { name, checked, desc, id } =
                                        structure;

                                    return (
                                        <li key={name}>
                                            <TileElement
                                                defaultIcon="ri-arrow-right-line"
                                                color={color}
                                                checked={checked}
                                                title={name}
                                                subTitle="subTitle"
                                                body={desc}
                                                onClick={onTileClick}
                                                id={id}
                                            ></TileElement>
                                        </li>
                                    );
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
            structure: [
                {
                    id: 0,
                    name: 'Structure 0',
                    desc: 'Description',
                },
                {
                    id: 1,
                    name: 'Structure 1',
                    desc: 'Description',
                },
                {
                    id: 2,
                    name: 'Structure 2',
                    desc: 'Description',
                },
                {
                    id: 3,
                    name: 'Structure 3',
                    desc: 'Description',
                },
            ],
            person: [
                {
                    id: 0,
                    name: 'Personne 0',
                    desc: 'Description',
                },
                {
                    id: 1,
                    name: 'Personne 1',
                    desc: 'Description',
                },
                {
                    id: 2,
                    name: 'Personne 2',
                    desc: 'Description',
                },
                {
                    id: 3,
                    name: 'Personne 3',
                    desc: 'Description',
                },
            ],
        },
    };
}
