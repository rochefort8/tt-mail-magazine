/*
 *
 *
 *
 *
 */
'use strict';

const config = require('../config');
const utils = require('./utils');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.email.sendgrid_apiKey);

const adminEmailAddress = config.admin.email;
const from_address 	= 'tt-official@tochikukai.com'
const from_name 	= '東京東筑会' ;

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
	// Configure the substitution tag wrappers globally
	sgMail.setSubstitutionWrappers('%', '%');
	const msg = {
	    to: sendTo,
	    from: {
		email : from_address,
		name  : from_name
	    },
	    subject: 'D',		/* Unused */
	    text: 'D',			/* Unused */
	    html: '<p>D</p>',	/* Unused */
	    templateId: template_id,
	    substitutions: {
		toWhom: toWhom,/* Full name, overwritten on template string */
		url:url        /* URL */
	    }
	}
	return sgMail.send(msg);    
}


module.exports = Email;
