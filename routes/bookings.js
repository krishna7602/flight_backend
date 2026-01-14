const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getBookings, 
  getBooking, 
  downloadTicket 
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/', protect, getBookings);
router.get('/:id', protect, getBooking);
router.get('/:id/pdf', protect, downloadTicket);

module.exports = router;