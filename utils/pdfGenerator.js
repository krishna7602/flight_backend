const PDFDocument = require('pdfkit');

const generateTicketPDF = (booking, flight) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header
      doc.fontSize(24).fillColor('#1e40af').text('Flight Ticket', { align: 'center' });
      doc.moveDown();
      
      // Divider
      doc.strokeColor('#e5e7eb').lineWidth(2).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // PNR
      doc.fontSize(14).fillColor('#000000').text(`PNR: ${booking.pnr}`, { bold: true });
      doc.moveDown(0.5);

      // Passenger Details
      doc.fontSize(11).fillColor('#4b5563').text('Passenger Details', { underline: true });
      doc.fontSize(10).fillColor('#000000');
      doc.text(`Name: ${booking.passenger_name}`);
      doc.moveDown();

      // Flight Details
      doc.fontSize(11).fillColor('#4b5563').text('Flight Details', { underline: true });
      doc.fontSize(10).fillColor('#000000');
      doc.text(`Airline: ${flight.airline}`);
      doc.text(`Flight ID: ${flight.flight_id}`);
      doc.text(`Route: ${flight.departure_city} → ${flight.arrival_city}`);
      doc.text(`Departure: ${flight.departure_time}`);
      doc.text(`Arrival: ${flight.arrival_time}`);
      doc.text(`Duration: ${flight.duration}`);
      doc.moveDown();

      // Payment Details
      doc.fontSize(11).fillColor('#4b5563').text('Payment Details', { underline: true });
      doc.fontSize(10).fillColor('#000000');
      doc.text(`Amount Paid: ₹${booking.final_price.toLocaleString()}`);
      doc.text(`Booking Date: ${new Date(booking.booking_date).toLocaleString('en-IN')}`);
      doc.moveDown();

      // Footer
      doc.moveDown(2);
      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);
      doc.fontSize(8).fillColor('#6b7280').text(
        'This is an electronic ticket. Please carry a valid ID proof while traveling.',
        { align: 'center' }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateTicketPDF };