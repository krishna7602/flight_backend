const Flight = require('../models/Flight');
const { calculateDynamicPrice, recordBookingAttempt } = require('../utils/pricingEngine');

// @desc    Get all flights
// @route   GET /api/flights
// @access  Private
const getFlights = async (req, res) => {
  try {
    const { departure_city, arrival_city, sortBy } = req.query;
    
    let query = {};
    
    // Filter by cities if provided
    if (departure_city) {
      query.departure_city = new RegExp(departure_city, 'i');
    }
    if (arrival_city) {
      query.arrival_city = new RegExp(arrival_city, 'i');
    }

    let flights = await Flight.find(query).limit(10);

    // Sort if requested
    if (sortBy === 'price_low') {
      flights.sort((a, b) => a.base_price - b.base_price);
    } else if (sortBy === 'price_high') {
      flights.sort((a, b) => b.base_price - a.base_price);
    }

    // Calculate dynamic pricing for each flight
    const flightsWithPricing = await Promise.all(
      flights.map(async (flight) => {
        const pricing = await calculateDynamicPrice(req.user._id, flight._id);
        return {
          ...flight.toObject(),
          currentPrice: pricing.finalPrice,
          surgeApplied: pricing.surgeApplied,
          attemptCount: pricing.attemptCount
        };
      })
    );

    res.json(flightsWithPricing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single flight with dynamic pricing
// @route   GET /api/flights/:id
// @access  Private
const getFlight = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    const pricing = await calculateDynamicPrice(req.user._id, flight._id);

    res.json({
      ...flight.toObject(),
      currentPrice: pricing.finalPrice,
      surgeApplied: pricing.surgeApplied,
      attemptCount: pricing.attemptCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record booking attempt (for pricing)
// @route   POST /api/flights/:id/attempt
// @access  Private
const recordAttempt = async (req, res) => {
  try {
    await recordBookingAttempt(req.user._id, req.params.id);
    
    const pricing = await calculateDynamicPrice(req.user._id, req.params.id);
    
    res.json({
      currentPrice: pricing.finalPrice,
      surgeApplied: pricing.surgeApplied,
      attemptCount: pricing.attemptCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFlights,
  getFlight,
  recordAttempt
};