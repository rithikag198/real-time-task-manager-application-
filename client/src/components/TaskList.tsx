import React, { useState } from 'react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (id: string, taskData: { title?: string; description?: string; status?: string }) => Promise<void>;
  onTaskDelete: (id: string) => Promise<void>;
  onTaskToggle: (id: string) => Promise<void>;
  isLoading: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  onTaskToggle,
  isLoading,
}) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
  });

  const handleEdit = (task: Task) => {
    setEditingTask(task._id);
    setEditFormData({
      title: task.title,
      description: task.description,
    });
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditFormData({ title: '', description: '' });
  };

  const handleSaveEdit = async (taskId: string) => {
    if (!editFormData.title.trim()) return;

    try {
      await onTaskUpdate(taskId, {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
      });
      handleCancelEdit();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onTaskDelete(taskId);
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Tasks ({tasks.length})</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task._id} className="p-6">
            {editingTask === task._id ? (
              <div className="space-y-4">
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Task title"
                />
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Task description"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveEdit(task._id)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => onTaskToggle(task._id)}
                    className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      task.status === 'completed'
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300 hover:border-indigo-600'
                    }`}
                  >
                    {task.status === 'completed' && (
                      <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${
                      task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className={`mt-1 text-sm ${
                        task.status === 'completed' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {task.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                      {task.updatedAt !== task.createdAt && (
                        <span className="ml-2">• Updated: {new Date(task.updatedAt).toLocaleDateString()}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    task.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                  <button
                    onClick={() => handleEdit(task)}
                    className="text-indigo-600 hover:text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
