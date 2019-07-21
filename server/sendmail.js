/*
 *
 *
 *
 *
 */
'use strict';

const config = require('../config');
const utils = require('./utils');
const sendgrid   = require('sendgrid')(config.email.sendgrid_apiKey);
const email      = new sendgrid.Email();

const adminEmailAddress = config.admin.email;

var Email = function() {}

const template_id_array = [
	'be6f86db-d13c-43df-953a-4e1f12afce3f',
	'bc3a6b44-f2f4-47a3-aefa-e87a6fa91f8d',
	'224d49fc-078c-4d2e-a636-ef4b97e9b974',
	'a839351c-582e-4200-895f-c06a097d8167'
];

Email.send = function(type,sendTo,toWhom,url) {
    var template_id = '';

    switch (type) {
	case 'registration-request':
		template_id = template_id_array[0];
		break ;

    case 'registration-success':
		template_id = template_id_array[1];
		break ;

	case 'delete-request':
		template_id = template_id_array[2];
		break ;

	case 'delete-success':
		template_id = template_id_array[3];
		break ;
		
	default:
		console.log('No such type:', + type);
		return ;
    }
    return this._send(template_id,sendTo,toWhom,url);
}

Email._send = function(template_id,sendTo,toWhom,url) {
	var from       = "tt-official@tochikukai.com";
	var fiscalYear = utils.getCureentFiscalYear();

	email.setTos(sendTo);
	email.setFrom(from);
	email.fromname = '東京東筑会';
	email.setSubject('D');
	email.setText('D');
	email.setHtml('<strong> </strong>');
	email.addSubstitution('%toWhom%', toWhom);
	email.addSubstitution('%url%', url);
	email.addSubstitution('%fiscal-year%', fiscalYear);

	email.addFilter('templates','template_id',template_id);

	sendgrid.send(email, function(err, json) {
		if (err) { return console.error(err); }
		console.log(json);
    });
}

Email.sendToAdmin = function(toWhom,email,phone,address) {

}

module.exports = Email;
