import {
    Col,
    Row,
    Container,
    Button,
    Callout,
    CalloutText,
    CalloutTitle,
} from '@dataesr/react-dsfr';
import CardInfo from '../../CardInfo';
import Map from '../../Map';

export default function History({ section }) {
    return (
        <Container>
            <Row gutters>
                <Col n="12">
                    <Container>
                        <Row spacing="px-2w">
                            <Col spacing="pb-2w">
                                <Map />
                            </Col>
                        </Row>
                        <Row spacing="px-2w">
                            <Col spacing="pb-8w pr-1w">
                                <Callout
                                    hasInfoIcon={false}
                                    colorFamily="green-tilleul-verveine"
                                >
                                    <CalloutTitle>Téléphone</CalloutTitle>
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
                                    <CalloutTitle>Adresse</CalloutTitle>
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
                    </Container>
                </Col>
            </Row>
        </Container>
    );
}
