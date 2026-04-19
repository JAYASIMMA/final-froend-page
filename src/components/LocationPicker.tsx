import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LocationMarkerProps {
    position: L.LatLng | null;
    setPosition: (pos: L.LatLng) => void;
}

function LocationMarker({ position, setPosition }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

interface LocationPickerProps {
    defaultLocation?: [number, number];
    onLocationSelect?: (pos: L.LatLng) => void;
}

export default function LocationPicker({ defaultLocation, onLocationSelect }: LocationPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    defaultLocation ? new L.LatLng(defaultLocation[0], defaultLocation[1]) : null
  );

  const handleSetPosition = (pos: L.LatLng) => {
    setPosition(pos);
    if (onLocationSelect) onLocationSelect(pos);
  };

  return (
    <div style={{ height: '300px', width: '100%', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', overflow: 'hidden' }} className="glass">
      <MapContainer 
        center={defaultLocation || [12.9716, 77.5946]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker position={position} setPosition={handleSetPosition} />
      </MapContainer>
    </div>
  );
}
