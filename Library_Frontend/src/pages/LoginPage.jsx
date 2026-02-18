import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('[login] Sending login request', { url: '/api/auth/login', payload: form });
      const { data } = await authAPI.login(form);
      console.log('[login] Response', data);
      localStorage.setItem('token', data.token);
      // Dispatch event to notify App component of token update
      window.dispatchEvent(new Event('tokenUpdated'));
      navigate('/dashboard');
    } catch (error) {
      console.error('[login] Error response', error.response?.data || error.message || error);
      alert('Login failed: ' + (error.response?.data?.message || error.message || 'Try again'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LibraryHub
          </h1>
          <p className="text-gray-600 mt-2">Admin Dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary text-lg font-semibold py-4"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800 text-center">
            admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
