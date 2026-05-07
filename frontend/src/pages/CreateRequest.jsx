import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestService } from '../services/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const CreateRequest = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    patientName: '', bloodGroup: '', unitsNeeded: 1,
    urgency: 'normal', contactPhone: '',
    hospital: { name: '', address: '', location: { coordinates: [] } },
    notes: '',
  });

  const detectHospitalLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm({
          ...form,
          hospital: {
            ...form.hospital,
            location: { type: 'Point', coordinates: [pos.coords.longitude, pos.coords.latitude] },
          },
        });
        toast.success('Hospital location set to your current location');
      },
      () => toast.error('Could not detect location')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.hospital.location.coordinates.length) {
      toast.error('Please set the hospital location first');
      return;
    }
    setLoading(true);
    try {
      const { data } = await requestService.create(form);
      toast.success(`Request created! ${data.notifiedDonors} donors notified nearby.`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const set = (field, value) => setForm({ ...form, [field]: value });
  const setHospital = (field, value) => setForm({ ...form, hospital: { ...form.hospital, [field]: value } });

  const URGENCY_OPTIONS = [
    { value: 'normal', label: '🟢 Normal', desc: 'Within a few days' },
    { value: 'urgent', label: '🟡 Urgent', desc: 'Within 24 hours' },
    { value: 'critical', label: '🔴 Critical', desc: 'Immediately needed' },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Blood Request</h1>
        <p className="text-gray-500 text-sm mt-1">Nearby donors will be notified immediately</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Info */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Patient Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Patient Name</label>
              <input type="text" required className="input-field" placeholder="Patient full name"
                value={form.patientName} onChange={(e) => set('patientName', e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Blood Group Needed</label>
              <select required className="input-field" value={form.bloodGroup}
                onChange={(e) => set('bloodGroup', e.target.value)}>
                <option value="">Select group</option>
                {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Units Needed</label>
              <input type="number" min="1" max="10" required className="input-field"
                value={form.unitsNeeded} onChange={(e) => set('unitsNeeded', Number(e.target.value))} />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Phone</label>
              <input type="tel" required className="input-field" placeholder="+91 9876543210"
                value={form.contactPhone} onChange={(e) => set('contactPhone', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Urgency */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-3">Urgency Level</h2>
          <div className="grid grid-cols-3 gap-3">
            {URGENCY_OPTIONS.map(({ value, label, desc }) => (
              <button
                key={value} type="button"
                onClick={() => set('urgency', value)}
                className={`p-3 rounded-lg border-2 text-left transition-colors ${
                  form.urgency === value ? 'border-blood-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Hospital */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Hospital Details</h2>
            <button type="button" onClick={detectHospitalLocation} className="text-xs text-blood-600 hover:underline">
              📍 Use current location
            </button>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Hospital Name</label>
            <input type="text" required className="input-field" placeholder="City Hospital"
              value={form.hospital.name} onChange={(e) => setHospital('name', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Hospital Address</label>
            <input type="text" required className="input-field" placeholder="123 Main St, City"
              value={form.hospital.address} onChange={(e) => setHospital('address', e.target.value)} />
          </div>
          {form.hospital.location.coordinates.length > 0 && (
            <p className="text-xs text-green-600">✅ Location captured: {form.hospital.location.coordinates.map(c => c.toFixed(4)).join(', ')}</p>
          )}
        </div>

        {/* Notes */}
        <div className="card">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Additional Notes (optional)</label>
          <textarea rows={3} className="input-field resize-none" placeholder="Any additional information..."
            value={form.notes} onChange={(e) => set('notes', e.target.value)} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
          {loading ? 'Creating request...' : '🆘 Create Emergency Request'}
        </button>
      </form>
    </div>
  );
};

export default CreateRequest;
