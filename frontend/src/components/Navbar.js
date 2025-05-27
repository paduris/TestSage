import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CircleUser, BarChart3, GitBranch, Settings, Zap, Menu, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const location = useLocation();
  const { selectedRepository } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  const navItems = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <BarChart3 size={18} />
    },
    {
      path: '/repositories',
      label: 'Repositories',
      icon: <GitBranch size={18} />
    },
    {
      path: '/risk-configs',
      label: 'Risk Configurations',
      icon: <Settings size={18} />
    }
  ];
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 text-blue-600">
                <Zap size={24} className="text-blue-600" />
                <span className="font-bold text-xl">TestSage</span>
              </Link>
            </div>
            
            {/* Desktop menu */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`${
                    isActive(item.path)
                      ? 'border-blue-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Repository name display when selected */}
          {selectedRepository && (
            <div className="hidden md:flex items-center">
              <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 flex items-center">
                <GitBranch size={16} className="mr-1" />
                <span className="text-sm font-medium">{selectedRepository.name}</span>
              </div>
            </div>
          )}
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${
                  isActive(item.path)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </div>
              </Link>
            ))}
            
            {/* Repository name in mobile menu when selected */}
            {selectedRepository && (
              <div className="pl-3 pr-4 py-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <GitBranch size={16} className="mr-1 text-blue-600" />
                  <span>Repository: {selectedRepository.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
