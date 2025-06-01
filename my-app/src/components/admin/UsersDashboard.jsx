import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const UsersDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ fullName: '' });
  const navigate = useNavigate();

  const users = [
    { id: 1, name: 'Bob Simons', email: 'sabren@comcast.net', team: 'Technology', address: '3605 Parker Rd.', doj: 'April 28, 2016' },
    { id: 2, name: 'Joan Smith', email: 'raines@optonline.net', team: 'Accounts', address: '3890 Poplar Dr.', doj: 'March 6, 2018' },
    { id: 3, name: 'Bob Simons', email: 'crowemojo@hotmail.com', team: 'Investors', address: '775 Rolling Green Rd.', doj: 'September 9, 2022' },
    { id: 4, name: 'Joan Smith', email: 'bockelboy@att.net', team: 'Accounts', address: '1234 Main St.', doj: 'March 13, 2014' },
    { id: 5, name: 'Maria Stevens', email: 'sravani@yahoo.com', team: 'Brand', address: '567 Oak Ave.', doj: 'May 20, 2015' },
    { id: 6, name: 'James Ruskin', email: 'miami@aol.com', team: 'R&D', address: '7529 E. Pecan St.', doj: 'October 24, 2021', highlighted: true },
    { id: 7, name: 'David Kemp', email: 'danzigism@aol.com', team: 'Accounts', address: '8558 Green Rd.', doj: 'September 24, 2020' },
    { id: 8, name: 'John Smith', email: 'ewaters@comcast.net', team: 'Technology', address: '8558 Green Rd.', doj: 'February 9, 2019' }
  ];

  const getTeamColor = (team) => {
    const colors = {
      'Technology': 'bg-blue-100 text-blue-800 border-blue-200',
      'Accounts': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Investors': 'bg-green-100 text-green-800 border-green-200',
      'Brand': 'bg-teal-100 text-teal-800 border-teal-200',
      'R&D': 'bg-red-100 text-red-800 border-red-200',
      'Finance': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[team] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ fullName: user.name });
    setShowModal(true);
  };

  const handleUpdate = () => {
    // Simulate updating user (no backend implemented)
    console.log('Updating user:', { ...editingUser, name: formData.fullName });
    setShowModal(false);
    // Refresh the current route to simulate data update
    navigate('/admin/users', { replace: true });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header title="Users" searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Full Name</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Email-ID</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Team</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Address</th>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">DOJ</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    user.highlighted ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <span 
                        className={`font-medium cursor-pointer ${
                          user.highlighted 
                            ? 'bg-green-100 text-green-800 px-3 py-1 rounded border border-green-200' 
                            : 'text-gray-900 hover:text-blue-600'
                        }`}
                        onClick={() => handleEdit(user)}
                      >
                        {user.name}
                      </span>
                      {user.highlighted && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-blue-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTeamColor(user.team)}`}>
                      {user.team}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.address}</td>
                  <td className="px-6 py-4 text-gray-600">{user.doj}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Full Name"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersDashboard;