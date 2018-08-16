/* ========================================================================
 * Tokyo Tochiku mail magazine registration system : registrator.js
 * ========================================================================
 *
 * Copyright (c) 2018 Yuji Ogihara, all rights reserved.
 *
 * ======================================================================== */

require('dotenv').config();
const crypto = require('crypto');

const email_service = require('./email_service')(process.env.SENDGRID_API_KEY);
//const database = require('./db');
const database = require('./db2');
var  db = new database();

var url_base = '';

const ve = require('./mailgun');

var Registrator = function () {
    if (!(this instanceof Registrator)) {
	return new EmailService(apiKey);
    }
}



Registrator.requestRegistration = async function(email,last_name,first_name,graduate) {

    var result = {
	status:'',
	message:''
    };
    var is_exist='';
    await email_service.queryRecipient(email)
    .then(function (item) {
	    if (item != null) {
		is_exist='y';
	    } 
	})
    .catch(function (error) {
	    console.log(error);
	});
    if (is_exist != '') {
	result.status = 'success';
	result.message = 'data-exists';
	return result ;
    }

    var entity = await db.query(email);
    console.log(entity);

    if (entity != null) {
	var key = entity.key ;    
	console.log("Same key exist");
	await db.delete(key);
    }
    var key = await db.put(email,last_name,first_name,graduate,'register');
    ve.send(email,last_name,url_base + '?registration=' + key);
    result.status = 'success';
    result.message = 'new';
    return result;
}

Registrator.doRegistration = async function(key) {

    var result = {
	status:'',
	message:''
    };
    var entity = await db.get(key);
    console.log(entity);
    if (entity != null) {
	var email = entity.email ;
	var last_name = entity.last_name ;
	var first_name = entity.first_name ;
	var graduate = entity.graduate ;
	await email_service.addRecipient(email,last_name,first_name,graduate);

	await db.delete(entity.key);
	result.status = 'success';

    } else {
	console.log('Key ' + key + ' not found.');
	// return error
	result.status = 'error';
	result.message = 'Key ' + key + ' not found.';
    }
    return result ;
}

Registrator.requestDelete = async function(email) {

    var result = {
	status:'',
	message:''
    };
    var is_exist='';
    await email_service.queryRecipient(email)
    .then(function (item) {
	    if (item != null) {
		is_exist='y';
	    } 
	})
    .catch(function (error) {
	    console.log(error);
	});
    if (is_exist == '') {
	result.status = 'success';
	result.message = 'data-nonexist';
	return result ;
    }

    var entity = await db.query(email);
    console.log(entity);

    if (entity != null) {
	var email = entity.email ;
	var last_name = entity.last_name ;    
	var first_name = entity.first_name ;    
	var key = entity.key ;    
	console.log("Same key exist");
	await db.delete(key);
    }
    var key = await db.put(email,last_name,first_name,'delete');
    ve.send(email,last_name,url_base + '?delete=' + key);
    result.status = 'success';
    result.message = 'new';
    return result;
}

Registrator.doDelete = async function(key) {

    var result = {
	status:'',
	message:''
    };
    var entity = await db.get(key);
    console.log(entity);
    if (entity != null) {
	var email = entity.email ;
	
	await email_service.deleteRecipient(email);

	await db.delete(entity.key);
	result.status = 'success';

    } else {
	console.log('Key ' + key + ' not found.');
	// return error
	result.status = 'error';
	result.message = 'Key ' + key + ' not found.';
    }
    return result ;
}

Registrator.handlePost = async function(req, res) {

    let {action,key,email,graduate,last_name,first_name} = req.body;
    url_base = req.protocol + '://' + req.headers.host + '/index.html';

    try {
	switch (action) {
	case 'request_registration':

	    result = await this.requestRegistration(email,last_name,first_name,graduate);
	    break;
	case 'do_registration':
	    result = await this.doRegistration(key);
	    break;
	case 'request_delete':
	    result = await this.requestDelete(email);
	    break;
	case 'do_delete':
	    result = await this.doDelete(key);
	    break;
	default:
	    break;
	}
	return res.status(200).json({type:result.status, message: result.message}) ;
    } catch (err) {
	console.log(err);
	return res.status(500).json({type: err.type, message: err.message});
    }
}

module.exports = Registrator;
