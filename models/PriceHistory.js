const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flight',
    required: true
  },
  attempt_time: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
priceHistorySchema.index({ user: 1, flight: 1, attempt_time: 1 });

// TTL index to auto-delete records after 10 minutes
priceHistorySchema.index({ attempt_time: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);