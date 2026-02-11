import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: 'all' | 'pending' | 'completed';
  setStatusFilter: (filter: 'all' | 'pending' | 'completed') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Tasks
          </label>
          <input
            type="text"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="sm:w-48">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'completed')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
