import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    role: 'seeker', bloodGroup: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created!');
      navigate(form.role === 'donor' ? '/donor/register' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🩸</div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join the blood donor community</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {/* Role */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
            {['seeker', 'donor'].map((r) => (
              <button
                key={r} type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                  form.role === r ? 'bg-white text-blood-600 shadow-sm' : 'text-gray-500'
                }`}
              >
                {r === 'seeker' ? '🔍 Seeking Blood' : '🩸 I\'m a Donor'}
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
            <input type="text" required className="input-field" placeholder="John Doe"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
            <input type="email" required className="input-field" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
            <input type="tel" required className="input-field" placeholder="+91 9876543210"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Blood Group</label>
            <select className="input-field" value={form.bloodGroup}
              onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}>
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Password</label>
            <input type="password" required minLength={6} className="input-field" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blood-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
