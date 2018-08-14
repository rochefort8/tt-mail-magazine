'use strict';

var aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient({region: 'ap-northeast-1'});
const crypto = require('crypto');

var Database = function (params) {
    if (!(this instanceof Database)) {
	return new Database(params);
    }

    //    const table_name='tt-mail-magazine-provisioner';
    const table_name='tt-mail-magazine-registrator';    
    var docClient = new aws.DynamoDB.DocumentClient({region: 'ap-northeast-1'});

    this.put = async function(email,last_name,first_name) {

	var now = this.getNow() ;
	var key = this.generateKey(email + now);	
	var item = {
	    key:key,
	    email:email,
	    last_name:last_name,
	    first_name:first_name,
	    creation_date:now
	};
	
	var params = {
	    TableName: table_name,
	    Item: item
	};
	var res = await docClient.put(params).promise();
	return (key);
    }

    this.query = async function (email) {
	var params = {
	    TableName: table_name,
	    IndexName: 'email-index',
	    ExpressionAttributeNames:{'#c': 'email'},
	    ExpressionAttributeValues:{':val': email},
	    KeyConditionExpression: '#c = :val'
	};

/*	
	docClient.query(params, function(err, data) {
	    if (err) {
		return null;
	    } else {
		return data;		
	    }
	}).promise();
*/
	return docClient.query(params).promise();
    };

    this.get = async function (key) {
	var params = {
	    TableName : table_name,
	    Key: {
		'key': key,
	    }
	};
/*
	docClient.get(params, function(err, data) {
	    if (err){
		console.log(err);
	    } else {
		console.log(data);
	    }
	});
*/
	res = await docClient.get(params) ;
	console.log(res);
    }

    this.delete = async function (key) {
	var params = {
	    TableName : table_name,
	    Key: {
		'key': key,
	    }
	};
/*
	docClient.delete(params, function(err, data) {
	    if (err){
		console.log(err);
	    } else {
		console.log(data);
	    }
	});
*/
	docClient.delete(params).promise();
    }
    
    this.getNow = function() {
	var now = new Date();
	var year = now.getFullYear();
	var mon = now.getMonth()+1;
	var day = now.getDate();
	var hour = now.getHours();
	var min = now.getMinutes();
	var sec = now.getSeconds();

	var s = year + '-' + mon +  '-' + day +  '-' + hour + '-' + min + '-' +  sec ;
	return s;

    }
    
    this.generateKey = function(str) {
	const shasum = crypto.createHash('sha1');
	shasum.update(str);
	let hash = shasum.digest('hex');
	return hash;
    }

}

module.exports = Database ;

