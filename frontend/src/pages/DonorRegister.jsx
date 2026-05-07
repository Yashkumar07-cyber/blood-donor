import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donorService } from '../services/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [form, setForm] = useState({
    bloodGroup: '',
    location: { type: 'Point', coordinates: [], address: '', city: '', state: '' },
    medicalInfo: { weight: '', age: '' },
  });

  const detectLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        // Use reverse geocoding via OpenStreetMap (free)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const geo = await res.json();
          setForm({
            ...form,
            location: {
              type: 'Point',
              coordinates: [longitude, latitude],
              address: geo.display_name,
              city: geo.address?.city || geo.address?.town || geo.address?.village || '',
              state: geo.address?.state || '',
            },
          });
          toast.success('Location detected!');
        } catch {
          setForm({ ...form, location: { ...form.location, coordinates: [longitude, latitude] } });
          toast.success('Coordinates captured');
        } finally {
          setLocationLoading(false);
        }
      },
      () => {
        toast.error('Could not detect location');
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.location.coordinates.length) {
      toast.error('Please detect your location first');
      return;
    }
    setLoading(true);
    try {
      await donorService.registerDonor(form);
      toast.success('Donor profile created! You can now receive emergency alerts.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🩸</div>
        <h1 className="text-2xl font-bold text-gray-900">Register as Donor</h1>
        <p className="text-gray-500 text-sm mt-1">You'll receive alerts for nearby emergencies</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="card space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Blood Group</label>
            <select required className="input-field" value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
              <option value="">Select your blood group</option>
              {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Age</label>
              <input type="number" min="18" max="65" className="input-field" placeholder="25"
                value={form.medicalInfo.age}
                onChange={(e) => setForm({ ...form, medicalInfo: { ...form.medicalInfo, age: Number(e.target.value) } })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Weight (kg)</label>
              <input type="number" min="50" className="input-field" placeholder="60"
                value={form.medicalInfo.weight}
                onChange={(e) => setForm({ ...form, medicalInfo: { ...form.medicalInfo, weight: Number(e.target.value) } })} />
            </div>
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="font-semibold text-gray-900">Your Location</h2>
          <p className="text-xs text-gray-500">This helps seekers find you in emergencies. Your exact address is never shown publicly.</p>
          <button type="button" onClick={detectLocation} disabled={locationLoading} className="btn-secondary w-full">
            {locationLoading ? '📍 Detecting...' : '📍 Detect My Location'}
          </button>
          {form.location.city && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm font-medium text-green-800">✅ Location set</p>
              <p className="text-xs text-green-600 mt-0.5">{form.location.city}, {form.location.state}</p>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
          {loading ? 'Registering...' : '🩸 Register as Donor'}
        </button>
      </form>
    </div>
  );
};

export default DonorRegister;
