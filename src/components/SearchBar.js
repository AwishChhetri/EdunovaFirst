import React from 'react';

const SearchBar = ({ onSearch, onAddClick, onFilterChange }) => {
  return (
    <div className="flex justify-between mb-4">
      {/* Search Input */}
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Add Member Button */}
      <button
        onClick={onAddClick}
        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
      >
        Add Member
      </button>
    </div>
  );
};

export default SearchBar;
