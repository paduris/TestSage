import React from 'react';

const Footer = () => (
  <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 z-10">
    <div className="flex justify-between items-center text-sm text-gray-600">
      <span>© 2025 TestSage. All rights reserved.</span>
      <div className="flex gap-4">
        <a href="#" className="hover:text-blue-600">Privacy Policy</a>
        <a href="#" className="hover:text-blue-600">Terms of Service</a>
        <a href="#" className="hover:text-blue-600">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
