import React, { useState } from 'react';

interface TaskFormProps {
  onTaskCreate: (taskData: { title: string; description?: string }) => Promise<void>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Task title is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onTaskCreate({
        title: formData.title.trim(),
        description: formData.description.trim(),
      });
      setFormData({ title: '', description: '' });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description (optional)..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
