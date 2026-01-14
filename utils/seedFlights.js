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
// Add more flights to the array
const moreFlights = [
    {
        flight_id: 'AI102',
        airline: 'Air India',
        departure_city: 'Bangalore',
        arrival_city: 'Mumbai',
        base_price: 2600,
        departure_time: '07:30 AM',
        arrival_time: '09:45 AM',
        duration: '2h 15m'
    },
    {
        flight_id: 'SG203',
        airline: 'SpiceJet',
        departure_city: 'Chennai',
        arrival_city: 'Hyderabad',
        base_price: 2200,
        departure_time: '10:00 AM',
        arrival_time: '11:45 AM',
        duration: '1h 45m'
    },
    {
        flight_id: 'UK101',
        airline: 'Vistara',
        departure_city: 'Delhi',
        arrival_city: 'Mumbai',
        base_price: 3000,
        departure_time: '05:00 AM',
        arrival_time: '07:15 AM',
        duration: '2h 15m'
    }
];

// Combine and sort by base_price
flights.push(...moreFlights);
flights.sort((a, b) => a.base_price - b.base_price);
const additionalFlights = [
    {
        flight_id: 'AI103',
        airline: 'Air India',
        departure_city: 'Hyderabad',
        arrival_city: 'Chennai',
        base_price: 1800,
        departure_time: '08:00 AM',
        arrival_time: '09:30 AM',
        duration: '1h 30m'
    },
    {
        flight_id: 'SG204',
        airline: 'SpiceJet',
        departure_city: 'Mumbai',
        arrival_city: 'Pune',
        base_price: 1500,
        departure_time: '11:00 AM',
        arrival_time: '12:15 PM',
        duration: '1h 15m'
    },
    {
        flight_id: 'UK102',
        airline: 'Vistara',
        departure_city: 'Bangalore',
        arrival_city: 'Delhi',
        base_price: 3200,
        departure_time: '06:30 AM',
        arrival_time: '09:00 AM',
        duration: '2h 30m'
    },
    {
        flight_id: 'AI104',
        airline: 'Air India',
        departure_city: 'Kolkata',
        arrival_city: 'Mumbai',
        base_price: 2900,
        departure_time: '07:00 AM',
        arrival_time: '09:45 AM',
        duration: '2h 45m'
    },
    {
        flight_id: 'SG205',
        airline: 'SpiceJet',
        departure_city: 'Pune',
        arrival_city: 'Bangalore',
        base_price: 2100,
        departure_time: '02:00 PM',
        arrival_time: '03:45 PM',
        duration: '1h 45m'
    }
];

flights.push(...additionalFlights);
flights.sort((a, b) => a.base_price - b.base_price);