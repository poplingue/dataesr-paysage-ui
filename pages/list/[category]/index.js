import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { AppContext } from '../../../context/GlobalState';
import { getObjectType } from '../../../helpers/constants';
import grid from '../../../helpers/imports';
import useCSSProperty from '../../../hooks/useCSSProperty';

const CardInfo = dynamic(() => import('./../../../components/CardInfo'));
const CardLink = dynamic(() => import('./../../../components/CardLink'));
const Layout = dynamic(() => import('./../../../components/Layout'));
const ExportList = dynamic(() => import('./../../../components/ExportList'));
const HeaderLayout = dynamic(() =>
    import('./../../../components/HeaderLayout')
);
const List = dynamic(() => import('./../../../components/List'));

export default function Category(props) {
    const { Col, Row, Container } = grid();

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

    // TODO replace by <Card>
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
                                            {exportMode ? (
                                                <CardInfo
                                                    actionLabel="Sélectionner"
                                                    checked={checked}
                                                    supInfo={name}
                                                    title={name}
                                                    onClick={onTileClick}
                                                    icon="ri-arrow-right-line"
                                                    id={id}
                                                    subInfo={desc}
                                                />
                                            ) : (
                                                <Col spacing="py-1w">
                                                    <CardLink
                                                        link={`/object/structure/${id}`}
                                                        supInfo={name}
                                                        subInfo={desc}
                                                        info={name}
                                                    />
                                                </Col>
                                            )}
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
