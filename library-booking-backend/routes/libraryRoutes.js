const express = require('express');
const router = express.Router();
const {
  getLibraries,
  getFeaturedLibraries,
  getLibrary,
  createLibrary,
  updateLibrary,
  deleteLibrary,
  getMyLibraries
} = require('../controllers/libraryController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getLibraries);
router.get('/featured', getFeaturedLibraries);
router.get('/my-libraries', protect, authorize('librarian'), getMyLibraries);
router.get('/:id', getLibrary);
router.post('/', protect, authorize('librarian'), upload.array('images', 5), createLibrary);
router.put('/:id', protect, authorize('librarian'), upload.array('images', 5), updateLibrary);
router.delete('/:id', protect, authorize('librarian'), deleteLibrary);

module.exports = router;
