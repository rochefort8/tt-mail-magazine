/* ========================================================================
 * Tokyo Tochiku mail magazine registration system : index.js
 * ========================================================================
 *
 * Copyright (c) 2018 Yuji Ogihara, all rights reserved.
 *
 * ======================================================================== */

var express = require('express');
var router = express.Router();

const config = require('../config');
const registrator = require('../server/registrator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Expose the Stripe publishable key and other pieces of config via an endpoint.
router.get('/config', (req, res) => {

const url_base = req.protocol + '://' + req.headers.host + '/index.html?key=';
console.log(url_base);

  res.json({
  stripePublishableKey: config.stripe.publishableKey,
  });
});

router.post('/command', async (req, res, next) => {
	return await registrator.handlePost(req,res);
});

module.exports = router;
