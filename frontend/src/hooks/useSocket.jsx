import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

    // If donor, join their notification room
    if (user.role === 'donor') {
      socketRef.current.emit('join_donor_room', user._id);
    }

    // Listen for blood request alerts
    socketRef.current.on('new_blood_request', (data) => {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-red-600 text-white p-4 rounded-xl shadow-lg max-w-sm`}>
          <p className="font-semibold text-sm">🩸 Emergency Blood Request!</p>
          <p className="text-sm mt-1">{data.message}</p>
          <p className="text-xs mt-1 opacity-80">Urgency: {data.urgency.toUpperCase()}</p>
        </div>
      ), { duration: 8000 });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  return socketRef.current;
};
