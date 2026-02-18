import { useState, useEffect } from 'react';
import { studentsAPI } from '../services/api';
import { logout } from '../services/auth';
import Layout from '../components/common/Layout';
import { Trash2, Edit2, Plus, Search, AlertCircle } from 'lucide-react';

export default function StudentPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    department: '',
    contact: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (searchTerm = '') => {
    try {
      setLoading(true);
      setError('');
      const { data } = await studentsAPI.list(searchTerm);
      setStudents(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearch(term);
    if (term) {
      fetchStudents(term);
    } else {
      fetchStudents();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (editingId) {
        await studentsAPI.update(editingId, formData);
      } else {
        await studentsAPI.create(formData);
      }
      
      setFormData({ name: '', rollNo: '', department: '', contact: '' });
      setEditingId(null);
      setShowForm(false);
      fetchStudents(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentsAPI.remove(id);
        fetchStudents(search);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const handleEdit = (student) => {
    setFormData(student);
    setEditingId(student._id);
    setShowForm(true);
  };

  return (
    <Layout onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
            <p className="text-gray-600 mt-2">Add, edit, or manage student records</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ name: '', rollNo: '', department: '', contact: '' });
            }}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Student
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Student Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Roll No"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Add'} Student
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students by name or roll no..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Students Table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {students.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No students found. Add your first student!</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Roll No</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                      <td className="px-6 py-4 text-gray-700">{student.rollNo}</td>
                      <td className="px-6 py-4 text-gray-700">{student.department}</td>
                      <td className="px-6 py-4 text-gray-700">{student.contact}</td>
                      <td className="px-6 py-4 text-center flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
