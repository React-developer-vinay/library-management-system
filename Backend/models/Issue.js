// backend/models/Issue.js
const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  issueDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },      // planned
  actualReturnDate: { type: Date },
  status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' },
  fine: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
