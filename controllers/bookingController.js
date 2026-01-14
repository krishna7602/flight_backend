const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const User = require('../models/User');
const { calculateDynamicPrice, recordBookingAttempt } = require('../utils/pricingEngine');
const { generateTicketPDF } = require('../utils/pdfGenerator');

// Generate unique PNR
const generatePNR = () => {
  return 'PNR' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { flightId, passengerName } = req.body;

    if (!flightId || !passengerName) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Get flight
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    // Check seat availability
    if (flight.available_seats <= 0) {
      return res.status(400).json({ message: 'No seats available' });
    }

    // Record attempt and calculate price
    await recordBookingAttempt(req.user._id, flightId);
    const pricing = await calculateDynamicPrice(req.user._id, flightId);

    // Check wallet balance
    const user = await User.findById(req.user._id);
    if (user.walletBalance < pricing.finalPrice) {
      return res.status(400).json({ 
        message: 'Insufficient wallet balance',
        required: pricing.finalPrice,
        available: user.walletBalance
      });
    }

    // Deduct from wallet
    user.walletBalance -= pricing.finalPrice;
    await user.save();

    // Update available seats
    flight.available_seats -= 1;
    await flight.save();

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      flight: flightId,
      pnr: generatePNR(),
      passenger_name: passengerName,
      final_price: pricing.finalPrice
    });

    const populatedBooking = await Booking.findById(booking._id).populate('flight');

    res.status(201).json({
      booking: populatedBooking,
      walletBalance: user.walletBalance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('flight')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('flight');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Download ticket PDF
// @route   GET /api/bookings/:id/pdf
// @access  Private
const downloadTicket = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('flight');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking belongs to user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const pdfBuffer = await generateTicketPDF(booking, booking.flight);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=ticket-${booking.pnr}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBooking,
  downloadTicket
};