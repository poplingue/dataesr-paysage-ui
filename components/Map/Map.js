import L from 'leaflet';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import * as ReactLeaflet from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const { MapContainer, TileLayer, Marker, Popup } = ReactLeaflet;

const Map = ({ markers, height, width, lat, lng }) => {
    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconUrl:
                'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl:
                'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        });
    }, []);

    const DEFAULT_CENTER = [lat, lng];

    return (
        <MapContainer
            center={DEFAULT_CENTER}
            zoom={12}
            style={{ height, width }}
            scrollWheelZoom={false}
            attributionControl
        >
            <TileLayer
                attribution="<a href='https://www.jawg.io' target='_blank'>&copy; Jawg</a>"
                url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=5V4ER9yrsLxoHQrAGQuYNu4yWqXNqKAM6iaX5D1LGpRNTBxvQL3enWXpxMQqTrY8"
            />
            {markers.map((marker) => (
                <Marker position={marker.latLng} key={marker.latLng}>
                    <Popup>{marker.address}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;

Map.defaultProps = {
    markers: [{ latLng: [48.866667, 2.333333], address: 'Paris centre' }],
    height: '300px',
    width: '100%',
};

Map.propTypes = {
    markers: PropTypes.array,
    height: PropTypes.string,
    width: PropTypes.string,
};
