/**
 * config.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet).
 */

'use strict';

// Load environment variables from the `.env` file.
require('dotenv').config();

module.exports = {
  // Default country for the checkout form.
  country: 'JP',

  // Store currency.
  // Note: A few payment methods like iDEAL or SOFORT only work with euros,
  // so it's a good common denominator to test both Elements and Sources.
  currency: 'jpy',

  // Configuration for Stripe.
  // API Keys: https://dashboard.stripe.com/account/apikeys
  // Webhooks: https://dashboard.stripe.com/account/webhooks
  // Storing these keys and secrets as environment variables is a good practice.
  // You can fill them in your own `.env` file.

  amount: '3112',
  stripe: {
    // The two-letter country code of your Stripe account (required for Payment Request).
    country: 'JP',
    // API version to set for this app (Stripe otherwise uses your default account version).
    apiVersion: '2018-02-06',
    // Use your test keys for development and live keys for real charges in production.
    // For non-card payments like iDEAL, live keys will redirect to real banking sites.
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
  },

  email: {
	apiKey: process.env.SENDGRID_API_KEY,
	mailgun_apiKey:process.env.MAILGUN_API_KEY,
  },

  admin: {
	email: process.env.ADMIN_EMAIL,
  },

  // Server port.
  port: process.env.PORT || 8000,
};
