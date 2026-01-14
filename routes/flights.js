const express = require('express');
const router = express.Router();
const { getFlights, getFlight, recordAttempt } = require('../controllers/flightController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getFlights);
router.get('/:id', protect, getFlight);
router.post('/:id/attempt', protect, recordAttempt);

module.exports = router;