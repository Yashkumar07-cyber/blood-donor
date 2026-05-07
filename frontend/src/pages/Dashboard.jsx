import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestService, donorService } from '../services/api';
import BloodBadge from '../components/common/BloodBadge';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [donorProfile, setDonorProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.role === 'seeker' || user?.role === 'admin') {
          const { data } = await requestService.getMyRequests();
          setMyRequests(data.data);
        }
        if (user?.role === 'donor') {
          // Try to get donor profile
          try {
            const { data } = await donorService.getNearby({ lat: 0, lng: 0, radius: 0 });
          } catch {}
        }
      } catch (err) {
        toast.error('Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const URGENCY_COLORS = {
    normal: 'bg-blue-100 text-blue-700',
    urgent: 'bg-yellow-100 text-yellow-700',
    critical: 'bg-red-100 text-red-700',
  };

  const STATUS_COLORS = {
    open: 'bg-green-100 text-green-700',
    fulfilled: 'bg-gray-100 text-gray-600',
    expired: 'bg-gray-100 text-gray-400',
    cancelled: 'bg-red-100 text-red-500',
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <div className="text-gray-400">Loading...</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome, {user?.name} 👋</p>
        </div>
        <div className="flex gap-2">
          {user?.bloodGroup && <BloodBadge group={user.bloodGroup} size="lg" />}
          <span className="badge bg-gray-100 text-gray-600 capitalize text-xs px-3 py-1">{user?.role}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { to: '/find-donors', icon: '🔍', label: 'Find Donors' },
          { to: '/request/new', icon: '🆘', label: 'Request Blood' },
          { to: '/requests', icon: '📋', label: 'All Requests' },
          { to: user?.role === 'donor' ? '/donor/profile' : '/donor/register', icon: '🩸', label: user?.role === 'donor' ? 'My Donor Profile' : 'Become Donor' },
        ].map(({ to, icon, label }) => (
          <Link key={to} to={to} className="card text-center hover:shadow-md transition-shadow hover:border-blood-200 group">
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{icon}</div>
            <p className="text-xs font-medium text-gray-700">{label}</p>
          </Link>
        ))}
      </div>

      {/* My Blood Requests */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">My Blood Requests</h2>
          <Link to="/request/new" className="btn-primary text-sm py-1.5">+ New Request</Link>
        </div>

        {myRequests.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p>No blood requests yet</p>
            <Link to="/request/new" className="btn-primary text-sm mt-4 inline-block">Create First Request</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myRequests.map((req) => (
              <div key={req._id} className="card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BloodBadge group={req.bloodGroup} />
                  <div>
                    <p className="font-medium text-sm text-gray-900">{req.patientName}</p>
                    <p className="text-xs text-gray-500">{req.hospital?.name} • {req.unitsNeeded} units needed</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${URGENCY_COLORS[req.urgency]} text-xs capitalize`}>{req.urgency}</span>
                  <span className={`badge ${STATUS_COLORS[req.status]} text-xs capitalize`}>{req.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
