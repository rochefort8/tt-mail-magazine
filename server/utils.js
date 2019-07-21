/*
 *
 *
 *
 *
 */
'use strict';

const Fiscal = require('fiscal');
const fiscal = new Fiscal(3); 
const config = require('../config');
require('date-utils');

var Utils = function() {}

Utils.getCureentFiscalYear = function(date) {
	var info = fiscal.getFiscalInfoForDate(date) ;
	return info.fiscalYear.fiscalYear - 1;
}

module.exports = Utils;