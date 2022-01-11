import { Title } from '@dataesr/react-dsfr';
import dynamic from 'next/dynamic';
import React, { useContext } from 'react';
import CalloutPerson from '../../components/CalloutPerson';
import CardInfo from '../../components/CardInfo';
import CardLink from '../../components/CardLink';
import Field from '../../components/Field';
import FieldButton from '../../components/FieldButton';
import IconButton from '../../components/IconButton';
import ShowMoreList from '../../components/ShowMoreList';
import TileElement from '../../components/TileElement';
import { AppContext } from '../../context/GlobalState';
import { getObjectType } from '../../helpers/constants';
import dsfrGrid from '../../helpers/imports';
import useCSSProperty from '../../hooks/useCSSProperty';

const HeaderLayout = dynamic(() => import('./../../components/HeaderLayout'));
const Layout = dynamic(() => import('./../../components/Layout'));
const List = dynamic(() => import('./../../components/List'));

export default function Components() {
    const { Col, Row, Container } = dsfrGrid();
    const { dispatchPage: dispatch } = useContext(AppContext);
    const { style: green } = useCSSProperty('--success-main-525');

    return (
        <Layout>
            <HeaderLayout pageTitle={`Components`} />
            <Container>
                <Field
                    label="Field"
                    index={1}
                    section="Section"
                    title="Field"
                    value="Content field"
                >
                    <p>Test</p>
                </Field>
                <Row gutters>
                    <Col n="12">
                        <Title as="h2">To display lists</Title>
                    </Col>
                    <Col n="8">
                        <List>
                            <li>
                                <Col spacing="py-1w">
                                    <CardLink
                                        color={getObjectType(0).colorClassName}
                                        link=""
                                        info="CardLink with no link"
                                        subInfo="subInfo"
                                    />
                                </Col>
                            </li>
                            <li>
                                <Col spacing="py-1w">
                                    <CardLink
                                        color={getObjectType(1).colorClassName}
                                        link={`/object/person/8`}
                                        info="CardLink"
                                        subInfo="subInfo"
                                    />
                                </Col>
                            </li>
                            <li>
                                <Col spacing="py-1w">
                                    <CardLink
                                        link={`/object/person/8`}
                                        info="CardLink"
                                        subInfo="subInfo"
                                    />
                                </Col>
                            </li>
                        </List>
                    </Col>
                    <Col n="12">
                        <ShowMoreList>
                            <Col n="4">
                                <CardInfo
                                    externalLink="https://www.mozilla.fr"
                                    link="/update/person/1"
                                    supInfo="supInfo"
                                    title="CardInfo"
                                    subInfo="subInfo"
                                />
                            </Col>
                            <Col n="4">
                                <CardInfo
                                    externalLink="https://www.mozilla.fr"
                                    link="/update/person/1"
                                    supInfo="supInfo"
                                    title="CardInfo"
                                    subInfo="subInfo"
                                    actionLabel="actionLabel"
                                />
                            </Col>
                            <Col n="4">
                                <CardInfo
                                    externalLink="https://www.mozilla.fr"
                                    link="/update/person/1"
                                    supInfo="supInfo"
                                    title="CardInfo"
                                    subInfo="subInfo"
                                    actionLabel="actionLabel"
                                />
                            </Col>
                            <Col n="4">
                                <CardInfo
                                    externalLink="https://www.mozilla.fr"
                                    link="/update/person/1"
                                    supInfo="supInfo"
                                    title="CardInfo"
                                    subInfo="subInfo"
                                    actionLabel="actionLabel"
                                />
                            </Col>
                            <Col n="4">
                                <CardInfo
                                    externalLink="https://www.mozilla.fr"
                                    link="/update/person/1"
                                    supInfo="supInfo"
                                    title="CardInfo"
                                    subInfo="subInfo"
                                    actionLabel="actionLabel"
                                />
                            </Col>
                            <Col n="4">
                                <CardInfo
                                    externalLink="https://www.mozilla.fr"
                                    link="/update/person/1"
                                    supInfo="supInfo"
                                    title="CardInfo"
                                    subInfo="subInfo"
                                    actionLabel="actionLabel"
                                />
                            </Col>
                        </ShowMoreList>
                    </Col>
                </Row>
                <Row gutters>
                    <Col n="12">
                        <Title as="h2">To display informations</Title>
                    </Col>
                    <Col n="8">
                        <TileElement
                            onClick={() => {
                                dispatch({
                                    type: 'UPDATE_MODAL_DETAIL',
                                    payload: { open: true },
                                });
                            }}
                            title="TileElement"
                            body="body"
                            subTitle="subTitle"
                            id="1"
                            checked
                        />
                    </Col>
                    <Col n="4">
                        <TileElement
                            color={green}
                            onClick={() => {
                                dispatch({
                                    type: 'UPDATE_MODAL_DETAIL',
                                    payload: { open: true },
                                });
                            }}
                            title="TileElement"
                            body="body"
                            subTitle="subTitle"
                            id="1"
                            checked
                        />
                    </Col>
                    <Col n="4">
                        <CardInfo
                            externalLink="https://www.mozilla.fr"
                            link="/update/person/1"
                            supInfo="supInfo"
                            title="CardInfo"
                            subInfo="subInfo"
                            actionLabel="actionLabel"
                        />
                    </Col>
                    <Col>
                        <CardLink
                            color={getObjectType(1).colorClassName}
                            link={`/object/person/8`}
                            info="CardLink"
                            subInfo="subInfo"
                            supInfo="supInfo"
                        />
                    </Col>
                    <Col>
                        <CardLink
                            link="/object/structure/0"
                            supInfo="supInfo"
                            info="CardLink"
                            subInfo="subInfo"
                        />
                    </Col>
                </Row>
                <Row gutters>
                    <Col>
                        <CalloutPerson
                            title="CalloutPerson"
                            description="+33 15 78 54 34 99"
                        />
                    </Col>
                </Row>
                <Row gutters>
                    <Col n="12">
                        <Title as="h2">To display buttons</Title>
                    </Col>
                    <Col>
                        <FieldButton
                            onClick={() => {}}
                            size="sm"
                            title="FieldButton"
                        />
                    </Col>
                    <Col>
                        <IconButton
                            onClick={() => {}}
                            title={`Voir tout l'historique`}
                            icon="ri-eye-2-line"
                        />
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
}
