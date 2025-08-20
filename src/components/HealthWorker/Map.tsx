import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple } from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Correctly override the marker icon URLs
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

// Example coordinates for Rwanda provinces
const provinceMarkers: { name: string; position: LatLngTuple }[] = [
  { name: "Kigali", position: [-1.9403, 29.8739] },
  { name: "Northern Province", position: [-1.6, 29.8] },
  { name: "Southern Province", position: [-2.1, 29.7] },
  { name: "Eastern Province", position: [-2.0, 30.0] },
  { name: "Western Province", position: [-2.5, 29.3] },
];

const Map: React.FC = () => {
  return (
    <div className="map-container">
      <MapContainer 
        center={[-1.9403, 29.8739]} // Centered roughly in Rwanda
        zoom={8} 
        style={{ height: '340px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {provinceMarkers.map((province) => (
          <Marker key={province.name} position={province.position}>
            <Popup>{province.name}</Popup>
          </Marker>
        ))}

      </MapContainer>
    </div>
  );
};

export default Map;
