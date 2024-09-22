// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const twilio = require('twilio');

// Setup Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM;
const client = new twilio(accountSid, authToken);

// List of recipients from .env file
const recipients = process.env.RECIPIENTS.split(',');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Set up Multer for file uploads
const upload = multer({
  dest: 'uploads/', // Upload folder
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

// Endpoint to upload media and send a WhatsApp message
app.post('/send-media', upload.single('media'), async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    // Get file path
    const mediaPath = path.join(__dirname, req.file.path);

    // You would need to host the file publicly accessible via URL. 
    // For this example, we'll assume you have uploaded it somewhere and have a public URL.
    const mediaUrl = `https://your-public-url.com/${req.file.filename}`;

    // Message body
    const messageBody = req.body.message || 'Your appointment is coming up on July 21 at 3PM';

    // Send message to all recipients
    for (const recipient of recipients) {
      await client.messages.create({
        body: messageBody,
        from: fromWhatsApp,
        to: recipient,
        mediaUrl: [mediaUrl]
      });
      console.log(`Message sent to ${recipient}`);
    }

    // Respond success
    res.status(200).send('Messages with media sent successfully');
  } catch (error) {
    console.error('Failed to send message:', error);
    res.status(500).send('Error sending message');
  } finally {
    // Optionally remove the uploaded file after sending the message
    fs.unlinkSync(req.file.path); // Delete the file from the server after sending
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
