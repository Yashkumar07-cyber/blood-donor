import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useSocket } from './hooks/useSocket';

import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import FindDonors from './pages/FindDonors';
import Dashboard from './pages/Dashboard';
import CreateRequest from './pages/CreateRequest';
import DonorRegister from './pages/DonorRegister';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="text-gray-400 text-lg">Loading...</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Socket listener (needs to be inside AuthProvider)
const SocketListener = ({ children }) => {
  useSocket();
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SocketListener>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/find-donors" element={<FindDonors />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/request/new" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
              <Route path="/donor/register" element={<ProtectedRoute><DonorRegister /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Toaster position="top-right" />
        </SocketListener>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
