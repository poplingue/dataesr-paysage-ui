import {
    Button,
    Callout,
    CalloutText,
    CalloutTitle,
    Title,
} from '@dataesr/react-dsfr';
// import dynamic from 'next/dynamic';
import grid from '../../../helpers/imports';
import NoSsrWrapper from '../../../helpers/no-ssr-wrapper';
import { sectionUniqueId } from '../../../helpers/utils';
import CardInfo from '../../CardInfo';
import Map from '../../MapComponent';
import History from './History';

// const Map = dynamic(() => Promise.resolve('../../MapComponent'), {
//   ssr: false
// })

const components = {
    history: History,
};

export default function Presentation({ content, section, expand }) {
    const { Col, Row, Container } = grid();

    return (
        <>
            {content.map((subSection, index) => {
                const { title, component } = subSection;
                const dataSubSection = sectionUniqueId(title);
                const Component = components[component];

                return (
                    <div key={title} data-section={dataSubSection}>
                        <Container>
                            {index === 0 ? (
                                <>
                                    <Row spacing="px-2w">
                                        <Col spacing="pb-2w">
                                            <NoSsrWrapper>
                                                <Map />
                                            </NoSsrWrapper>
                                        </Col>
                                    </Row>
                                    <Row spacing="px-2w">
                                        <Col spacing="pb-8w pr-1w">
                                            <Callout
                                                hasInfoIcon={false}
                                                colorFamily="green-tilleul-verveine"
                                            >
                                                <CalloutTitle>
                                                    Téléphone
                                                </CalloutTitle>
                                                <CalloutText size="md">
                                                    +33 15 78 54 34 99
                                                </CalloutText>
                                            </Callout>
                                        </Col>
                                        <Col spacing="pb-8w pl-1w">
                                            <Callout
                                                hasInfoIcon={false}
                                                colorFamily="green-tilleul-verveine"
                                            >
                                                <CalloutTitle>
                                                    Adresse
                                                </CalloutTitle>
                                                <CalloutText size="md">
                                                    5 allée Jacques Berque
                                                    <br />
                                                    44000 Nantes
                                                </CalloutText>
                                            </Callout>
                                        </Col>
                                    </Row>
                                    <Row spacing="px-2w" gutters>
                                        <Col n="4">
                                            <CardInfo
                                                // onClick={}
                                                supInfo="date de création"
                                                title="6 avril 2012"
                                                actionLabel="Accéder au text officiel"
                                            />
                                        </Col>
                                        <Col n="4">
                                            <CardInfo
                                                // onClick={}
                                                supInfo="Tutelle"
                                                title="Ministre chargé de l'enseignement supérieur"
                                                actionLabel="Modifier"
                                            />
                                        </Col>
                                        <Col n="4">
                                            <CardInfo
                                                // onClick={}
                                                supInfo="Vague contractuelle"
                                                title="Vague E"
                                                actionLabel="Modifier"
                                            />
                                        </Col>
                                        <Col n="4">
                                            <CardInfo
                                                // onClick={}
                                                supInfo="Devise"
                                                title="Vade retro satanas"
                                                actionLabel="Modifier"
                                            />
                                        </Col>
                                        <Col n="4">
                                            <CardInfo
                                                // onClick={}
                                                supInfo="Statut juridique"
                                                title="Association déclarée, reconnue d'utilité publique depuis 2008"
                                                actionLabel="Modifier"
                                            />
                                        </Col>
                                        <Col n="4">
                                            <CardInfo
                                                // onClick={}
                                                supInfo="Logo"
                                                image="https://upload.wikimedia.org/wikipedia/fr/c/cd/Logo_Sorbonne_Universit%C3%A9.png"
                                                actionLabel="Modifier"
                                            />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            <Callout
                                                hasInfoIcon={false}
                                                colorFamily="blue-france"
                                            >
                                                <CalloutTitle>
                                                    Contacts génériques
                                                </CalloutTitle>
                                                <CalloutText size="md">
                                                    <ul>
                                                        <li>Contact 1</li>
                                                        <li>Contact 2</li>
                                                        <li>Contact 3</li>
                                                    </ul>
                                                </CalloutText>
                                                <div>
                                                    <Button
                                                        // size="sm"
                                                        title="Voir tout"
                                                        icon="ri-eye-2-line"
                                                    >
                                                        Voir tout
                                                    </Button>
                                                </div>
                                            </Callout>
                                        </Col>
                                    </Row>
                                </>
                            ) : null}
                            <Row spacing="px-2w">
                                <Col>
                                    <Title as="h3" look="h6">
                                        {title}
                                    </Title>
                                </Col>
                            </Row>
                            <Row spacing="px-2w">
                                <Col spacing="pb-8w">
                                    {Component && (
                                        <Component section={section} />
                                    )}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                );
            })}
        </>
    );
}
