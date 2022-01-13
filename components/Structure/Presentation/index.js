import { Title } from '@dataesr/react-dsfr';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';
import grid from '../../../helpers/imports';
import NoSsrWrapper from '../../../helpers/no-ssr-wrapper';
import { sectionUniqueId } from '../../../helpers/utils';
import History from './History';

const components = {
    history: History,
};

export default function Presentation({ content, section, expand }) {
    const { Col, Row, Container } = grid();

    return (
        <>
            {content.map((subSection) => {
                const { title, component } = subSection;
                const dataSubSection = sectionUniqueId(title);
                const Component = components[component];

                return (
                    <div key={title} data-section={dataSubSection}>
                        <Container fluid>
                            <Row spacing="px-2w">
                                <Col>
                                    <Title as="h3" look="h6">
                                        {title}
                                    </Title>
                                </Col>
                            </Row>
                            <Row spacing="px-2w">
                                <Col spacing="pb-8w">
                                    <NoSsrWrapper>
                                        <MapContainer
                                            center={[51.505, -0.09]}
                                            zoom={13}
                                            scrollWheelZoom={false}
                                            style={{
                                                height: 100,
                                                width: '100%',
                                            }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker position={[51.505, -0.09]}>
                                                <Popup>popip texte</Popup>
                                            </Marker>
                                        </MapContainer>
                                    </NoSsrWrapper>
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
