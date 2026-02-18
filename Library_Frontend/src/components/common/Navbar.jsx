import { Link } from 'react-router-dom';
import { LogOut, BookOpen } from 'lucide-react';

export default function Navbar({ onLogout }) {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 text-2xl font-bold">
          <BookOpen className="w-8 h-8" />
          LibraryHub
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="hover:text-blue-100 transition-colors">Dashboard</Link>
          <Link to="/books" className="hover:text-blue-100 transition-colors">Books</Link>
          <Link to="/students" className="hover:text-blue-100 transition-colors">Students</Link>
          <Link to="/issues" className="hover:text-blue-100 transition-colors">Issues</Link>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
