// backend/controllers/bookController.js
const Student = require('../models/Student');

const Book = require('../models/Book');
const Issue = require('../models/Issue');

exports.createBook = async (req, res, next) => {
  try {
    const { bookName, author, category, quantity } = req.body;
    const book = await Book.create({
      bookName,
      author,
      category,
      totalQuantity: quantity,
      availableQuantity: quantity
    });
    res.status(201).json(book);
  } catch (err) {
    next(err);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    const { search } = req.query;
    const filter = search
      ? { bookName: { $regex: search, $options: 'i' } }
      : {};
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const { bookName, author, category, totalQuantity, availableQuantity } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { bookName, author, category, totalQuantity, availableQuantity },
      { new: true }
    );
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const activeIssue = await Issue.findOne({ book: req.params.id, status: 'Issued' });
    if (activeIssue)
      return res.status(400).json({ message: 'Book is currently issued' });

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book deleted' });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const totalBooksAgg = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$totalQuantity' }, available: { $sum: '$availableQuantity' } } }
    ]);
    const totalBooks = totalBooksAgg[0]?.total || 0;
    const availableBooks = totalBooksAgg[0]?.available || 0;
    const issuedBooks = totalBooks - availableBooks;
   const totalStudents = await Student.countDocuments();


    res.json({ totalBooks, availableBooks, issuedBooks, totalStudents });
  } catch (err) {
    next(err);
  }
};
