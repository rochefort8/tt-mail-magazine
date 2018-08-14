/**
 * config.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet).
 */

'use strict';

// Load environment variables from the `.env` file.
require('dotenv').config();

module.exports = {
  sendgrid: {
	apiKey: process.env.SENDGRID_API_KEY,
  },

  // Server port.
  port: process.env.PORT || 8000,
};
