import { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';
import { logout } from '../services/auth';
import Layout from '../components/common/Layout';
import { Trash2, Edit2, Plus, Search, AlertCircle } from 'lucide-react';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    bookName: '',
    author: '',
    category: '',
    quantity: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (searchTerm = '') => {
    try {
      setLoading(true);
      setError('');
      const { data } = await booksAPI.list(searchTerm);
      setBooks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearch(term);
    if (term) {
      fetchBooks(term);
    } else {
      fetchBooks();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (editingId) {
        await booksAPI.update(editingId, {
          bookName: formData.bookName,
          author: formData.author,
          category: formData.category,
          totalQuantity: parseInt(formData.quantity),
          availableQuantity: parseInt(formData.quantity)
        });
      } else {
        await booksAPI.create({
          bookName: formData.bookName,
          author: formData.author,
          category: formData.category,
          quantity: parseInt(formData.quantity)
        });
      }
      
      setFormData({ bookName: '', author: '', category: '', quantity: '' });
      setEditingId(null);
      setShowForm(false);
      fetchBooks(search);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await booksAPI.remove(id);
        fetchBooks(search);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const handleEdit = (book) => {
    setFormData({
      bookName: book.bookName,
      author: book.author,
      category: book.category,
      quantity: book.totalQuantity
    });
    setEditingId(book._id);
    setShowForm(true);
  };

  return (
    <Layout onLogout={logout}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Books Management</h1>
            <p className="text-gray-600 mt-2">Add, edit, or manage books in the library</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({ bookName: '', author: '', category: '', quantity: '' });
            }}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Book
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
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Book' : 'Add New Book'}</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Book Name"
                value={formData.bookName}
                onChange={(e) => setFormData({ ...formData, bookName: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                min="1"
                required
              />
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingId ? 'Update' : 'Add'} Book
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
              placeholder="Search books by name..."
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

        {/* Books Table */}
        {!loading && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {books.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No books found. Add your first book!</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Book Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Total</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Available</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {books.map((book) => (
                    <tr key={book._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{book.bookName}</td>
                      <td className="px-6 py-4 text-gray-700">{book.author}</td>
                      <td className="px-6 py-4 text-gray-700">{book.category}</td>
                      <td className="px-6 py-4 text-center text-gray-700">{book.totalQuantity}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          book.availableQuantity > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {book.availableQuantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(book)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(book._id)}
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