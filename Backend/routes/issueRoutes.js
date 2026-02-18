// backend/routes/issueRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  issueBook,
  returnBook,
  getActiveIssues,
  getIssueHistory
} = require('../controllers/issueController');

router.use(auth);

router.post('/', issueBook);              // Issue Book Page
router.post('/:id/return', returnBook);   // Return Book Page
router.get('/', getActiveIssues);         // Issued books list
router.get('/history', getIssueHistory);  // Issue History page

module.exports = router;
