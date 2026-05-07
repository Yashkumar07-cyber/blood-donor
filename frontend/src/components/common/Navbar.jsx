import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-blood-600 text-xl">
          🩸 BloodConnect
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/find-donors" className="text-sm text-gray-600 hover:text-blood-600 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">
                Find Donors
              </Link>
              <Link to="/requests" className="text-sm text-gray-600 hover:text-blood-600 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">
                Requests
              </Link>
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-blood-600 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors">
                Dashboard
              </Link>
              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm text-gray-500">Hi, {user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} className="btn-secondary text-sm py-1.5">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary text-sm py-1.5">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
