import { io, Socket } from 'socket.io-client';
import { SocketEvents } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(userId: string) {
    if (this.socket?.connected) {
      this.disconnect();
    }

    this.userId = userId;
    this.socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket?.emit('joinUserRoom', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.userId = null;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Event listeners
  onTaskCreated(callback: (data: SocketEvents['taskCreated']) => void) {
    this.socket?.on('taskCreated', callback);
  }

  onTaskUpdated(callback: (data: SocketEvents['taskUpdated']) => void) {
    this.socket?.on('taskUpdated', callback);
  }

  onTaskDeleted(callback: (data: SocketEvents['taskDeleted']) => void) {
    this.socket?.on('taskDeleted', callback);
  }

  // Remove event listeners
  offTaskCreated(callback: (data: SocketEvents['taskCreated']) => void) {
    this.socket?.off('taskCreated', callback);
  }

  offTaskUpdated(callback: (data: SocketEvents['taskUpdated']) => void) {
    this.socket?.off('taskUpdated', callback);
  }

  offTaskDeleted(callback: (data: SocketEvents['taskDeleted']) => void) {
    this.socket?.off('taskDeleted', callback);
  }
}

export const socketService = new SocketService();
export default socketService;
