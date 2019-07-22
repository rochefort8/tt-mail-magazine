
const Mailchimp = require('mailchimp-api-v3');
const md5 = require('md5');

var ContactList = function (apiKey) {
    if (!(this instanceof ContactList)) {
	return new ContactList(apiKey);
    }

    if (typeof apiKey === 'string') {
	// Username and password
	this.api_key = apiKey;
    } else {
	// Won't be thrown?
	throw new Error('Need a username + password or api key!');
    }

    const mailchimp = new Mailchimp(this.api_key);

    const list_id='03a6dc0401';

    this.addRecipient = function(email,last_name,first_name,graduate) {

	var full_name = last_name + ' ' + first_name ;

	return mailchimp.post(
	    　　　　'/lists/' + list_id + '/members', {
		email_address : email,
		status : 'subscribed',
		merge_fields: {
		    "FULL_NAME": full_name
		},
	    });
    }
    
    this.updateRecipient = function(email,last_name,first_name,graduate) {

	var subscriber_hash = md5(email);	
	var full_name = last_name + ' ' + first_name ;

	return mailchimp.put(
	    '/lists/' + list_id + '/members/'+ subscriber_hash, {		    
	  email_address : email,
	      status : 'subscribed',
	      merge_fields: {
	      "FULL_NAME": full_name
		  },
	      });
    }

    
    this.deleteRecipient = function(email) {

	var subscriber_hash = md5(email);
	return mailchimp.put(
	    '/lists/' + list_id + '/members/'+ subscriber_hash, {
		status: 'unsubscribed'
	    });
/*	
	return mailchimp.post(
	    　　　　'/lists/' + list_id + '/members', {
		email_address : email,
		status : 'unsubscribed'
	);	
*/
    }

    this.queryRecipient = async function(email) {
	var subscriber_hash = md5(email);
	return mailchimp.get(
	    　　　　'/lists/' + list_id + '/members/'+ subscriber_hash
	    );
/*	
	);
	/*
	return mailchimp.get(
      　　　'/search-members?query=' + email, {
	  list_id : list_id,
      });
	*/
    }
};

module.exports = ContactList;
    



