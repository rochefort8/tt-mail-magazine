require('dotenv').config();
const crypto = require('crypto');

const email_service = require('./email_service')(process.env.SENDGRID_API_KEY);
//const database = require('./db');
const database = require('./db2');

//const verification = require('./verification');
const ve = require('./mailgun');

var  db = new database();
//var ve = new verification();

var Action = function () {
    if (!(this instanceof Action)) {
	return new EmailService(apiKey);
    }
}

const url_base = req.protocol + '://' + req.headers.host + '/index.html?key=';

Action.doProvisionalRegistration = async function(email,last_name,first_name) {

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
	var email = entity.email ;
	var last_name = entity.last_name ;    
	var key = entity.key ;    
	console.log("Same key exist");
	await db.delete(key);
    }
    var key = await db.put(email,last_name,first_name);
    ve.send(email,last_name,url_base + key);
    result.status = 'success';
    result.message = 'new';
    return result;
}

Action.doRegistration = async function(key) {

    var result = {
	status:'',
	message:''
    };
    var entity = await db.get(key);
    console.log(entity);
    if (entity != null) {
	var email = entity.email ;
	var last_name = entity.last_name ;
	await email_service.addRecipient(email,last_name,"");
	// async/await

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

Action.doRemove = async function(email) {

    var result = {
	status:'',
	message:''
    };
    await email_service.deleteRecipient(email);
    result.status = 'success';
    return result;
}

module.exports = Action;
