import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Component to fix map size issues
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
}

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom icon for selected marker
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapView({ profiles, onProfileClick, selectedProfile }) {
  console.log('MapView received profiles:', profiles.length);
  console.log('Profiles data:', profiles);
  
  // Default center for Sri Lanka
  const defaultCenter = [7.8731, 80.7718];
  const defaultZoom = 8;

  // Calculate center based on profiles if available
  const getMapCenter = () => {
    const validProfiles = profiles.filter(p => 
      p.latestCoordinates && p.latestCoordinates.latitude && p.latestCoordinates.longitude
    );
    
    console.log('Valid profiles with coordinates:', validProfiles.length);

    if (validProfiles.length === 0) return defaultCenter;

    const avgLat = validProfiles.reduce((sum, p) => sum + p.latestCoordinates.latitude, 0) / validProfiles.length;
    const avgLng = validProfiles.reduce((sum, p) => sum + p.latestCoordinates.longitude, 0) / validProfiles.length;
    
    console.log('Map center calculated:', [avgLat, avgLng]);

    return [avgLat, avgLng];
  };

  const mapCenter = getMapCenter();

  return (
    <div className="map-view">
      <MapContainer 
        center={mapCenter} 
        zoom={defaultZoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <MapResizer />
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          subdomains='abcd'
          maxZoom={20}
        />
        
        {profiles.map((profile) => {
          const { latitude, longitude, timestamp } = profile.latestCoordinates;
          
          if (!latitude || !longitude) {
            console.warn(`Profile ${profile.name} has invalid coordinates`);
            return null;
          }

          const isSelected = selectedProfile === profile._id;

          return (
            <Marker 
              key={profile._id} 
              position={[latitude, longitude]}
              icon={isSelected ? selectedIcon : new L.Icon.Default()}
              eventHandlers={{
                click: () => onProfileClick(profile._id)
              }}
            >
              <Popup>
                <div className="popup-content">
                  <h3>{profile.name}</h3>
                  <p><strong>Location:</strong> {profile.location}</p>
                  <p><strong>Coordinates:</strong> {latitude.toFixed(4)}, {longitude.toFixed(4)}</p>
                  {timestamp && (
                    <p><strong>Last Update:</strong> {new Date(timestamp).toLocaleString()}</p>
                  )}
                  <p><strong>Data Points:</strong> {profile.totalDataPoints}</p>
                  <button 
                    className="view-data-btn"
                    onClick={() => onProfileClick(profile._id)}
                  >
                    View Time Series Data
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <div className="map-legend">
        <h4>📍 Profile Locations</h4>
        <p>{profiles.length} weather profiles displayed</p>
      </div>
    </div>
  );
}

export default MapView;
