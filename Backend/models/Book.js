// backend/models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  bookName: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  totalQuantity: { type: Number, required: true, min: 0 },
  availableQuantity: { type: Number, required: true, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
