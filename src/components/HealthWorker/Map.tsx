import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Correctly override the marker icon URLs
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const Map: React.FC = () => {
  return (
    <div className="map-container">
      <MapContainer 
        center={[ -1.9403, 29.8739 ]} // Coordinates for Rwanda
        zoom={8} // Adjust zoom level as needed
        style={{ height: '340px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[ -1.9403, 29.8739 ]}>
          <Popup>
            Rwanda is here!
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
