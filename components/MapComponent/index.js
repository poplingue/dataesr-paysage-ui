import PropTypes from 'prop-types';
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet';

import { blueIcon } from './icons';
import styles from './Map.module.scss';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

export default function MapComponent({ markers, height, width }) {
    const markersComponents = markers.map((marker) => (
        <Marker
            position={marker}
            icon={blueIcon}
            key={`${marker.lat}-${marker.lng}`}
        >
            <Popup>{marker.address}</Popup>
        </Marker>
    ));

    return (
        <div className={styles.MapComponent}>
            <MapContainer
                className={styles.MapContainer}
                center={[48.866667, 2.333333]}
                zoom={12}
                style={{ height, width }}
                scrollWheelZoom={false}
                attributionControl
            >
                <TileLayer
                    attribution="<a href='https://www.jawg.io' target='_blank'>&copy; Jawg</a>"
                    url="https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=5V4ER9yrsLxoHQrAGQuYNu4yWqXNqKAM6iaX5D1LGpRNTBxvQL3enWXpxMQqTrY8"
                />
                {/* <Marker position={[51.505, -0.09]}>
            <Popup>
              popip texte
            </Popup>
          </Marker> */}
                {markersComponents.map((marker) => marker)}
            </MapContainer>
        </div>
    );
}

MapComponent.defaultProps = {
    markers: [{ lat: 48.866667, lng: 2.333333, address: 'Paris centre' }],
    height: '300px',
    width: '100%',
};

MapComponent.propTypes = {
    markers: PropTypes.array,
    height: PropTypes.string,
    width: PropTypes.string,
};
