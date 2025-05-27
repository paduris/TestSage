import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, GitBranch, AlertTriangle } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: <Home size={20} />, text: 'Dashboard', path: '/' },
    { icon: <GitBranch size={20} />, text: 'Repositories', path: '/repositories' },
    { icon: <AlertTriangle size={20} />, text: 'Analyses', path: '/analyses' },
  ];

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-20 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
    >
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
          >
            {item.icon}
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
