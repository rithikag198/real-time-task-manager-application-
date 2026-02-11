import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import socketService from '../services/socket';
import { Task, TaskStats as TaskStatsType } from '../types';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import TaskStatsComponent from '../components/TaskStats';
import SearchBar from '../components/SearchBar';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStatsType>({ total: 0, completed: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await taskAPI.getTasks(params);
      setTasks(response.tasks);
      setStats(response.stats);
      setError('');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Connect to socket
    socketService.connect(user.id);

    // Fetch initial tasks
    fetchTasks();

    // Set up socket listeners
    const handleTaskCreated = (data: any) => {
      if (data.userId === user.id) {
        setTasks(prev => [data.task, ...prev]);
        fetchTasks(); // Refetch to update stats
      }
    };

    const handleTaskUpdated = (data: any) => {
      if (data.userId === user.id) {
        setTasks(prev => prev.map(task => 
          task._id === data.task._id ? data.task : task
        ));
        fetchTasks(); // Refetch to update stats
      }
    };

    const handleTaskDeleted = (data: any) => {
      if (data.userId === user.id) {
        setTasks(prev => prev.filter(task => task._id !== data.taskId));
        fetchTasks(); // Refetch to update stats
      }
    };

    socketService.onTaskCreated(handleTaskCreated);
    socketService.onTaskUpdated(handleTaskUpdated);
    socketService.onTaskDeleted(handleTaskDeleted);

    return () => {
      socketService.offTaskCreated(handleTaskCreated);
      socketService.offTaskUpdated(handleTaskUpdated);
      socketService.offTaskDeleted(handleTaskDeleted);
      socketService.disconnect();
    };
  }, [user, navigate, fetchTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskCreate = async (taskData: { title: string; description?: string }) => {
    try {
      await taskAPI.createTask(taskData);
      // Socket will handle the update
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleTaskUpdate = async (id: string, taskData: { title?: string; description?: string; status?: string }) => {
    try {
      await taskAPI.updateTask(id, taskData);
      // Socket will handle the update
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleTaskDelete = async (id: string) => {
    try {
      await taskAPI.deleteTask(id);
      // Socket will handle the update
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete task');
    }
  };

  const handleTaskToggle = async (id: string) => {
    try {
      await taskAPI.toggleTaskStatus(id);
      // Socket will handle the update
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to toggle task status');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600">Welcome back, {user?.username}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Statistics */}
        <TaskStatsComponent stats={stats} />

        {/* Search and Filter */}
        <div className="mt-8">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        </div>

        {/* Task Form */}
        <div className="mt-8">
          <TaskForm onTaskCreate={handleTaskCreate} />
        </div>

        {/* Task List */}
        <div className="mt-8">
          <TaskList
            tasks={tasks}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onTaskToggle={handleTaskToggle}
            isLoading={isLoading}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
