# Flight Booking System Backend

## Overview
This is a backend service for a flight booking system built using Node.js, Express, and MongoDB. It provides RESTful APIs for managing flights, bookings, and user authentication.

## Features
- User authentication and authorization
- Flight management (CRUD operations)
- Booking management
- Input validation
- Error handling
- PDF generation for flight details

## Technologies Used
- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing flight and user data.
- **Mongoose**: ODM for MongoDB to manage data relationships.
- **dotenv**: For managing environment variables.
- **bcryptjs**: For password hashing.
- **jsonwebtoken**: For user authentication.
- **cors**: For enabling Cross-Origin Resource Sharing.
- **pdfkit**: For generating PDF documents.
- **express-validator**: For validating user input.

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure your environment variables.
4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints
- **Authentication**
  - `POST /api/auth/register`: Register a new user.
  - `POST /api/auth/login`: Login an existing user.

- **Flights**
  - `GET /api/flights`: Get all flights.
  - `POST /api/flights`: Create a new flight.
  - `PUT /api/flights/:id`: Update a flight.
  - `DELETE /api/flights/:id`: Delete a flight.

- **Bookings**
  - `GET /api/bookings`: Get all bookings.
  - `POST /api/bookings`: Create a new booking.

## Usage
- Ensure MongoDB is running and accessible.
- Use Postman or any API client to test the endpoints.

## License
This project is licensed under the MIT License.
