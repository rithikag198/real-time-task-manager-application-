export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  user: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface TasksResponse {
  tasks: Task[];
  stats: TaskStats;
}

export interface ApiResponse {
  message: string;
  [key: string]: any;
}

export interface SocketEvents {
  taskCreated: { task: Task; userId: string };
  taskUpdated: { task: Task; userId: string };
  taskDeleted: { taskId: string; userId: string };
}
