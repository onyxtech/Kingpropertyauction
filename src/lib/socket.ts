import { io, Socket } from 'socket.io-client';

let socketInstance: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socketInstance) {
    socketInstance = io(
      import.meta.env.VITE_API_URL || 'http://localhost:5000',
      {
        transports: ['websocket'],
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      }
    );

    socketInstance.on('connect', () => {
      console.log('🔌 Socket connected:', socketInstance?.id);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
    });

    socketInstance.on('connect_error', (err) => {
      console.error('🔌 Socket connection error:', err.message);
    });
  }

  return socketInstance;
};

export const disconnectSocket = (): void => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export default getSocket;
