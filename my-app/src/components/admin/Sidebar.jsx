import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Settings, BarChart3, Package, ShoppingCart, Users, FolderOpen, FileText, LifeBuoy, PieChart, Building2 } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: FolderOpen, label: 'Categories', path: '/admin/categories' },
    { icon: Building2, label: 'Businesses', path: '/admin/businesses' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
    { icon: PieChart, label: 'Analytics', path: '/admin/analytics' },
    { icon: LifeBuoy, label: 'Support', path: '/admin/support' }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
                aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
      
      {/* User Profile */}
      <div className="absolute bottom-6 left-6 flex items-center space-x-3">
        <img 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format" 
          alt="Profile" 
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="font-medium text-blue-600">Hello, John Doe</div>
          <button
            onClick={() => navigate('/admin/profile')}
            className="text-sm text-gray-500 hover:underline"
          >
            Open profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;