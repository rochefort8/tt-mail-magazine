'use strict';

const crypto = require('crypto');
const Datastore = require('@google-cloud/datastore');
 
// Your Google Cloud Platform project ID
const projectId = 'tt-mail-magazine';
 
// Creates a client
const datastore = new Datastore({
	projectId: projectId,
    });

var Database = function (params) {
    if (!(this instanceof Database)) {
	return new Database(params);
    }


    this.put = async function(email,last_name,first_name,action) {
	var now = this.getNow() ;
	var key = this.generateKey(email + now);	
	const datastore_key = datastore.key('list');
	const item = {
	    key: datastore_key,
	    data: {
		action:action,
		last_name: last_name,
		first_name:first_name,
		graduate:'',
		email: email,
		key:key,
		created:now
	    }
	}
	console.log('PUT');
	console.log(item);

	await datastore.save(item)
	.then(() => {
		console.log(item.key);
	    })
	.catch(err => {
		console.error('ERROR:', err);
	    });
	return key;

    }
    this.query = async function (email) {
	var entity = {
	    key:'',
	    email:'',
	    last_name:'',
	    first_name:'',
	    graduate:'',
	};

	const query = datastore.createQuery('list').filter('email', '=', email);
	await datastore.runQuery(query)
	.then(results => {
		const res = results[0];
		
		if (res[0] != null) {
		    entity.key = res[0].key;
		    entity.email = res[0].email;
		    entity.last_name = res[0].last_name;
		    entity.first_name = res[0].first_name;
		    entity.graduate = res[0].graduate;
		} else {
		    entity = null ;
		}
	    })
	.catch(err => {
		console.error('ERROR:', err);
		entity = null;
	    });
	return entity;

    }

    this.get = async function (key) {
	const query = datastore.createQuery('list').filter('key', '=', key);
	var entity = {
	    key:'',
	    email:'',
	    last_name:'',
	    first_name:'',
	    graduate:'',
	};

	await datastore.runQuery(query)
	.then(results => {

		const res = results[0];
		console.log(res);
		if (res[0] != null) {
		    entity.key = res[0].key;
		    entity.email = res[0].email;
		    entity.last_name = res[0].last_name;
		    entity.first_name = res[0].first_name;
		    entity.graduate = res[0].graduate;
		}
	    })
	.catch(err => {
		console.error('ERROR:', err);
		entity = null;
	    });

	return entity;

    }

    this.delete = async function (key) {
	const query = datastore.createQuery('list').filter('key', '=', key);
	await datastore.runQuery(query).then(results => {
		const res = results[0];
		datastore.delete(res[0][datastore.KEY]).then(() => {
			console.log("Successfully removed.");
		    });
	    });	
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

};

module.exports = Database ;

//var  db = new Database();
//console.log(db);



