const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getStats
} = require('../controllers/bookController');


router.use(auth);

router.post('/', createBook);          // Add Book Page
router.get('/', getBooks);            // View Books + search
router.get('/stats', getStats);       // Dashboard cards
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;
