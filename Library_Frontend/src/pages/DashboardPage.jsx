import { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';
import { logout } from '../services/auth';
import Layout from '../components/common/Layout';
import StatsCard from '../components/auth/dashboard/students/StatsCard';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await booksAPI.stats();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout onLogout={logout}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your library overview.</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Stats Grid */}
        {!loading && stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Books" 
              value={stats.totalBooks} 
              color="blue"
              description="books in library"
            />
            <StatsCard 
              title="Available Books" 
              value={stats.availableBooks} 
              color="green"
              description="ready to issue"
            />
            <StatsCard 
              title="Issued Books" 
              value={stats.issuedBooks} 
              color="yellow"
              description="currently with students"
            />
            <StatsCard 
              title="Total Students" 
              value={stats.totalStudents} 
              color="purple"
              description="registered students"
            />
          </div>
        )}

        {/* Refresh Button */}
        {!loading && (
          <div className="flex justify-end">
            <button
              onClick={fetchStats}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Statistics
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}