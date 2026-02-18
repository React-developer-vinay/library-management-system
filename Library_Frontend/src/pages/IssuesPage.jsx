import { useState, useEffect } from 'react';
import { issuesAPI, booksAPI, studentsAPI } from '../services/api';
import { logout } from '../services/auth';
import Layout from '../components/common/Layout';
import { Plus, ArrowRight, AlertCircle } from 'lucide-react';

export default function IssuesPage() {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [formData, setFormData] = useState({
    studentId: '',
    bookId: '',
    issueDate: new Date().toISOString().split('T')[0],
    returnDate: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [issuesData, booksData, studentsData] = await Promise.all([
        issuesAPI.list(),
        booksAPI.list(),
        studentsAPI.list()
      ]);
      
      setIssues(issuesData.data || []);
      setBooks(booksData.data || []);
      setStudents(studentsData.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      await issuesAPI.issue({
        studentId: formData.studentId,
        bookId: formData.bookId,
        issueDate: formData.issueDate,
        returnDate: formData.returnDate
      });
      
      setFormData({
        studentId: '',
        bookId: '',
        issueDate: new Date().toISOString().split('T')[0],
        returnDate: ''
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue book');
    }
  };

  const handleReturn = async (issueId) => {
    try {
      const actualReturnDate = new Date().toISOString().split('T')[0];
      await issuesAPI.return(issueId, { actualReturnDate });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book');
    }
  };

  const filteredIssues = issues.filter(issue => 
    activeTab === 'active' ? issue.status === 'Issued' : issue.status === 'Returned'
  );

  return (
    <Layout onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Issues</h1>
            <p className="text-gray-600 mt-2">Manage book issues and returns</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Issue Book
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Issue Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Issue New Book</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a student</option>
                  {students.map(student => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.rollNo})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Book</label>
                <select
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a book</option>
                  {books.map(book => (
                    <option key={book._id} value={book._id}>
                      {book.bookName} (Available: {book.availableQuantity})
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="date"
                placeholder="Return Date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Issue Book
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

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'active'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Issues
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Return History
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Issues List */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {filteredIssues.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No {activeTab} issues yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Book</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Issue Date</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Return Date</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
                      {activeTab === 'active' && <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Action</th>}
                      {activeTab === 'history' && <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Fine</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredIssues.map((issue) => (
                      <tr key={issue._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{issue.student?.name}</td>
                        <td className="px-6 py-4 text-gray-700">{issue.book?.bookName}</td>
                        <td className="px-6 py-4 text-center text-gray-700">{new Date(issue.issueDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-center text-gray-700">{new Date(issue.returnDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            issue.status === 'Issued'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {issue.status}
                          </span>
                        </td>
                        {activeTab === 'active' && (
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleReturn(issue._id)}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm"
                            >
                              <ArrowRight className="w-4 h-4" />
                              Return
                            </button>
                          </td>
                        )}
                        {activeTab === 'history' && (
                          <td className="px-6 py-4 text-center text-gray-700">
                            <span className={issue.fine > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                              ₹{issue.fine || 0}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}