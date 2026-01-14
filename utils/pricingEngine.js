const PriceHistory = require('../models/PriceHistory');
const Flight = require('../models/Flight');

/**
 * Calculate dynamic price based on booking attempts
 * Rules: 
 * - 3+ attempts within 5 minutes = 10% price increase
 * - Price resets after 10 minutes (handled by TTL index)
 */
const calculateDynamicPrice = async (userId, flightId) => {
  try {
    const flight = await Flight.findById(flightId);
    if (!flight) {
      throw new Error('Flight not found');
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    // Count attempts in last 5 minutes
    const recentAttempts = await PriceHistory.countDocuments({
      user: userId,
      flight: flightId,
      attempt_time: { $gte: fiveMinutesAgo }
    });

    let finalPrice = flight.base_price;
    let surgeApplied = false;

    // Apply 10% surge if 3 or more attempts
    if (recentAttempts >= 3) {
      finalPrice = Math.round(flight.base_price * 1.1);
      surgeApplied = true;
    }

    return {
      basePrice: flight.base_price,
      finalPrice,
      surgeApplied,
      attemptCount: recentAttempts
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Record a booking attempt
 */
const recordBookingAttempt = async (userId, flightId) => {
  try {
    await PriceHistory.create({
      user: userId,
      flight: flightId,
      attempt_time: new Date()
    });
  } catch (error) {
    console.error('Error recording booking attempt:', error);
  }
};

module.exports = {
  calculateDynamicPrice,
  recordBookingAttempt
};