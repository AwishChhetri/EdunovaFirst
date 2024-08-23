import React, { useState } from 'react';
import { FaFilter, FaPlus } from 'react-icons/fa';

const SearchBar = ({ onSearch, onAddClick, onFilterChange }) => {
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedRoles((prev) => [...prev, value]);
    } else {
      setSelectedRoles((prev) => prev.filter((role) => role !== value));
    }
  };

  const handleTeamChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTeams((prev) => [...prev, value]);
    } else {
      setSelectedTeams((prev) => prev.filter((team) => team !== value));
    }
  };

  const applyFilters = () => {
    onFilterChange({ roles: selectedRoles, teams: selectedTeams });
    setIsFilterOpen(false); // Close the filter dropdown after applying filters
  };

  return (
    <div className="flex justify-between items-center mb-4 relative">
      {/* Search Bar */}
      <div className="relative flex items-center w-[400px]">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded-lg w-full"
        />
        <FaFilter
          className="ml-3 text-purple-600 text-xl font-bold cursor-pointer"
          onClick={toggleFilterDropdown}
        />
      </div>

      {/* Filter Dropdown */}
      {isFilterOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-300 shadow-lg rounded-lg p-4 w-[200px] z-50">
          <h4 className="text-gray-700 font-semibold mb-2">Filters</h4>
          <div className="mb-2">
            <h5 className="text-gray-600 font-medium">Roles</h5>
            <div className="flex flex-col">
              {['Developer', 'Design', 'Manager'].map((role) => (
                <label key={role}>
                  <input
                    type="checkbox"
                    value={role}
                    onChange={handleRoleChange}
                    className="mr-2"
                  />
                  {role}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <h5 className="text-gray-600 font-medium">Teams</h5>
            <div className="flex flex-col">
              {['Team A', 'Team B', 'Team C'].map((team) => (
                <label key={team}>
                  <input
                    type="checkbox"
                    value={team}
                    onChange={handleTeamChange}
                    className="mr-2"
                  />
                  {team}
                </label>
              ))}
            </div>
          </div>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded-lg w-full"
            onClick={applyFilters}
          >
            Apply
          </button>
        </div>
      )}

      {/* Add Member Button */}
      <button
        onClick={onAddClick}
        className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
      >
        <FaPlus className="mr-2" /> Add Member
      </button>
    </div>
  );
};

export default SearchBar;
