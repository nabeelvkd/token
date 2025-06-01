import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Settings } from 'lucide-react';

const Header = ({ title, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/admin/settings');
  };

  // Optional: Handle search submission (e.g., navigate to a search results page)
  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   if (searchTerm.trim()) {
  //     navigate(`/admin/search?query=${encodeURIComponent(searchTerm)}`);
  //   }
  // };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">14</div>
        <button
          onClick={handleSettingsClick}
          className="p-2 text-gray-400 hover:text-gray-600"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;