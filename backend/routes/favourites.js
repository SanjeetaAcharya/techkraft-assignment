const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getFavourites, addFavourite, removeFavourite } = require('../controllers/favouritesController');

router.get('/', protect, getFavourites);
router.post('/', protect, addFavourite);
router.delete('/:id', protect, removeFavourite);

module.exports = router;