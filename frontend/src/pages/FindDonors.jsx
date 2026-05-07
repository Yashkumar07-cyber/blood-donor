import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { donorService } from '../services/api';
import DonorCard from '../components/donor/DonorCard';
import DonorMap from '../components/map/DonorMap';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const FindDonors = () => {
  const [searchParams] = useSearchParams();
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [filters, setFilters] = useState({
    bloodGroup: searchParams.get('bloodGroup') || '',
    radius: 10,
  });
  const [view, setView] = useState('list');

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        toast.success('Location detected!');
      },
      () => toast.error('Could not get location. Please allow location access.')
    );
  };

  const searchDonors = async () => {
    if (!userLocation) {
      toast.error('Please detect your location first');
      return;
    }
    setLoading(true);
    try {
      const { data } = await donorService.getNearby({
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: filters.radius,
        bloodGroup: filters.bloodGroup || undefined,
      });
      setDonors(data.data);
      if (data.count === 0) toast('No donors found in this area. Try increasing the radius.', { icon: 'ℹ️' });
    } catch {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    if (userLocation) searchDonors();
  }, [userLocation]);

  const handleContact = (donor) => {
    if (donor.user?.phone) {
      window.open(`tel:${donor.user.phone}`);
    } else {
      toast('Contact info not available');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Find Nearby Donors</h1>
        <p className="text-gray-500 text-sm">Showing donors within {filters.radius} km</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Blood Group</label>
            <select
              className="input-field w-32"
              value={filters.bloodGroup}
              onChange={(e) => setFilters({ ...filters, bloodGroup: e.target.value })}
            >
              <option value="">All Groups</option>
              {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Radius: {filters.radius} km</label>
            <input
              type="range" min="1" max="50" step="1"
              value={filters.radius}
              onChange={(e) => setFilters({ ...filters, radius: Number(e.target.value) })}
              className="w-32"
            />
          </div>
          <button onClick={detectLocation} className="btn-secondary text-sm">
            📍 Detect Location
          </button>
          <button onClick={searchDonors} disabled={loading} className="btn-primary text-sm">
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
          <div className="ml-auto flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setView('list')} className={`px-3 py-1.5 text-sm ${view === 'list' ? 'bg-blood-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              List
            </button>
            <button onClick={() => setView('map')} className={`px-3 py-1.5 text-sm ${view === 'map' ? 'bg-blood-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              Map
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {view === 'map' ? (
        <DonorMap donors={donors} userLocation={userLocation} radius={filters.radius} />
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{donors.length} donor{donors.length !== 1 ? 's' : ''} found</p>
          {donors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {donors.map((donor) => (
                <DonorCard key={donor._id} donor={donor} onContact={handleContact} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">🔍</div>
              <p className="font-medium">No donors found</p>
              <p className="text-sm mt-1">Try increasing the search radius or selecting a different blood group</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FindDonors;
