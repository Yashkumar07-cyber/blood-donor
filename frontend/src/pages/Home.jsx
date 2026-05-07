import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blood-600 to-red-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🩸</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Blood Donors Near You
          </h1>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Connect with verified blood donors in emergencies. Save lives by becoming a donor or finding one instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/find-donors" className="bg-white text-blood-600 font-semibold px-8 py-3 rounded-xl hover:bg-red-50 transition-colors">
              🔍 Find Donors Now
            </Link>
            {!user && (
              <Link to="/register" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white hover:text-blood-600 transition-colors">
                Become a Donor
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Blood Groups */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Search by Blood Group</h2>
          <p className="text-center text-gray-500 mb-8 text-sm">Click a blood group to find matching donors</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {BLOOD_GROUPS.map((group) => (
              <Link
                key={group}
                to={`/find-donors?bloodGroup=${group}`}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-gray-100 hover:border-blood-500 hover:bg-red-50 transition-all group"
              >
                <span className="text-xl font-bold text-blood-600 group-hover:scale-110 transition-transform">
                  {group}
                </span>
                <span className="text-xs text-gray-400">Donors</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { n: '10,000+', label: 'Registered Donors' },
            { n: '5,000+', label: 'Lives Saved' },
            { n: '500+', label: 'Cities Covered' },
          ].map(({ n, label }) => (
            <div key={label} className="card">
              <p className="text-3xl font-bold text-blood-600">{n}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📍', title: 'Share Location', desc: 'Enable location or enter your city to find donors near you.' },
              { icon: '🔍', title: 'Search Donors', desc: 'Filter by blood group and radius to find compatible donors.' },
              { icon: '📞', title: 'Connect Instantly', desc: 'Contact donors directly or post an emergency request.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
