import { io } from 'socket.io-client';

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    const isProduction = import.meta.env.PROD || (
      typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1'
    );
    
    const socketUrl = isProduction ? 'https://codefusionprojects.onrender.com' : undefined;

    socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      // connected successfully
    });

    socketInstance.on('connect_error', (err) => {
      // connection fallback to polling
      console.warn('Real-time connection fallback active:', err.message);
    });
  }
  return socketInstance;
};
