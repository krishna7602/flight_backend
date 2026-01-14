require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const Flight = require('../models/Flight');
const connectDB = require('../config/db');

const flights = [
  {
    flight_id: 'AI101',
    airline: 'Air India',
    departure_city: 'Mumbai',
    arrival_city: 'Delhi',
    base_price: 2500,
    departure_time: '06:00 AM',
    arrival_time: '08:30 AM',
    duration: '2h 30m'
  },
  {
    flight_id: 'SG202',
    airline: 'SpiceJet',
    departure_city: 'Delhi',
    arrival_city: 'Bangalore',
    base_price: 2800,
    departure_time: '09:00 AM',
    arrival_time: '12:00 PM',
    duration: '3h 00m'
  },
  // … keep rest unchanged
];

const seedFlights = async () => {
  try {
    console.log('Connecting to DB:', process.env.MONGODB_URI);

    await connectDB();

    const countBefore = await Flight.countDocuments();
    console.log('Flights before seed:', countBefore);

    await Flight.deleteMany({});
    console.log('Cleared existing flights');

    await Flight.insertMany(flights);
    console.log(`${flights.length} flights seeded successfully`);

    const countAfter = await Flight.countDocuments();
    console.log('Flights after seed:', countAfter);

    await mongoose.connection.close();
    console.log('MongoDB connection closed');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding flights:', error);
    process.exit(1);
  }
};

seedFlights();
