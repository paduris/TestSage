import React from 'react';
import { FileCode, Settings, LogOut, Menu, X } from 'lucide-react';

const Header = ({ toggleSidebar, isSidebarOpen }) => (
  <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
    <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <FileCode size={24} className="text-blue-600" />
          <span className="text-xl font-semibold text-gray-800">TestSage</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Settings size={20} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-red-600">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  </header>
);

export default Header;
