// backend/controllers/issueController.js
const Issue = require('../models/Issue');
const Book = require('../models/Book');
const Student = require('../models/Student');
const calculateFine = require('../utils/calculateFine');

exports.issueBook = async (req, res, next) => {
  try {
    const { studentId, bookId, issueDate, returnDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.availableQuantity <= 0)
      return res.status(400).json({ message: 'Book not available' });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const issue = await Issue.create({
      student: studentId,
      book: bookId,
      issueDate,
      returnDate
    });

    book.availableQuantity -= 1;
    await book.save();

    res.status(201).json(issue);
  } catch (err) {
    next(err);
  }
};

exports.returnBook = async (req, res, next) => {
  try {
    const { actualReturnDate } = req.body;
    const issue = await Issue.findById(req.params.id).populate('book');
    if (!issue || issue.status === 'Returned')
      return res.status(404).json({ message: 'Issue not found or already returned' });

    const actual = new Date(actualReturnDate);
    const fine = calculateFine(issue.returnDate, actual);

    issue.actualReturnDate = actual;
    issue.status = 'Returned';
    issue.fine = fine;
    await issue.save();

    const book = await Book.findById(issue.book._id);
    book.availableQuantity += 1;
    await book.save();

    res.json(issue);
  } catch (err) {
    next(err);
  }
};

exports.getActiveIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({ status: 'Issued' })
      .populate('book', 'bookName author')
      .populate('student', 'name rollNo');
    res.json(issues);
  } catch (err) {
    next(err);
  }
};

exports.getIssueHistory = async (req, res, next) => {
  try {
    const issues = await Issue.find()
      .sort({ createdAt: -1 })
      .populate('book', 'bookName')
      .populate('student', 'name rollNo');
    res.json(issues);
  } catch (err) {
    next(err);
  }
};
