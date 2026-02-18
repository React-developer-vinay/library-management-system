import { useState } from 'react';
import { Menu, X, LogOut, Home, BookOpen, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Layout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: 'Dashboard', icon: Home, href: '/dashboard' },
    { label: 'Books', icon: BookOpen, href: '/books' },
    { label: 'Students', icon: Users, href: '/students' },
    { label: 'Issues', icon: FileText, href: '/issues' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col shadow-lg`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <Link to="/dashboard" className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-400" />
            {sidebarOpen && <span className="text-xl font-bold">LibraryHub</span>}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors group"
            >
              <item.icon className="w-5 h-5 text-gray-400 group-hover:text-blue-400" />
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-800"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
