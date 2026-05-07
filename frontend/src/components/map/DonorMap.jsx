import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import BloodBadge from '../common/BloodBadge';

// Fix default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const DonorMap = ({ donors, userLocation, radius = 10 }) => {
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [20.5937, 78.9629]; // Default: India center

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '400px' }}>
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User's search radius */}
        {userLocation && (
          <>
            <Marker position={[userLocation.lat, userLocation.lng]}>
              <Popup>📍 Your Location</Popup>
            </Marker>
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={radius * 1000}
              pathOptions={{ color: '#e53935', fillColor: '#e53935', fillOpacity: 0.05 }}
            />
          </>
        )}

        {/* Donor markers */}
        {donors.map((donor) => {
          const [lng, lat] = donor.location.coordinates;
          return (
            <Marker key={donor._id} position={[lat, lng]} icon={redIcon}>
              <Popup>
                <div className="text-sm">
                  <p className="font-semibold">{donor.user?.name}</p>
                  <BloodBadge group={donor.bloodGroup} />
                  <p className="text-gray-500 mt-1">{donor.location?.city}</p>
                  {donor.user?.phone && (
                    <a href={`tel:${donor.user.phone}`} className="text-blood-600 font-medium">
                      📞 {donor.user.phone}
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default DonorMap;
