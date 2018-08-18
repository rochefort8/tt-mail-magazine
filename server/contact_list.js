
const sendgrid_contact = require("./lib/sendgrid-contacts");

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

    const contact = new sendgrid_contact(apiKey);
    const list_id='4707395'; // TT_Test list ID
    // Test list
    // const list_id='4812497';

    this.getListId  = function() {
	contact.lists.getAllLists(function(err,resp,body) {
	    if (err) { return console.error(err); }
	    for(var i = 0; i < resp.lists.length; i++){
		list=resp.lists[i];

		//		if (list.name == 'TT_Test') {
		if (list.name == 'tt-mail-magazine') {
		    console.log(list.id);
		    return list.id ;
		}
	    }
	    return null;
	});
    }

    this.addRecipient = function(email,last_name,first_name,graduate) {

	var recipients = [{
	    email : email,
	    first_name : first_name,
	    last_name  : last_name,
	    full_name  : last_name + ' ' + first_name,
	    graduate   : graduate
	}];

	contact.recipients.addRecipients(recipients,function(err,resp) {
	    if (err) { return console.error(err); }

	    var params = {
		list_id : list_id,
	    };
	    var ids = [resp.persisted_recipients[0]];

	    console.log('Adding ' + email + '.id=' + resp.persisted_recipients[0]);
	    contact.lists.addListRecipients(params,ids,function(err,resp) {
		    if (err) { return console.error(err); }
		    console.log(resp);
		});
	});
    }

    this.deleteRecipient = function(email) {
	return new Promise(function (resolve,reject) {
	    var param = 'email=' + email;
	    contact.recipients.searchRecipients('email=' + email,function(err,resp,body) {
	        if (err) { 
		    console.error(err); 
		    resolve(null);
		} 
		if (resp.recipient_count >= 1) {
		    var recipient = resp.recipients[0] ;
		    var id = [recipient.id];

		    console.log('Removing ' + email + '.id=' + recipient.id);		

		    contact.recipients.deleteRecipients(id,function(err,resp) {
		        if (err) { return console.error(err); }
			console.log(resp);
			});
		    resolve(recipient);
		}
		resolve(null);
	    });
	});
    }

    this.queryRecipient = async function(email) {
	return new Promise(function (resolve,reject) {
	    var param = 'email=' + email;
	    contact.recipients.searchRecipients('email=' + email,function(err,resp,body) {
	        if (err) { 
		    console.error(err); 
		    resolve(null);
		} 
		if (resp.recipient_count >= 1) {
		    var recipient = resp.recipients[0] ;
		    resolve(recipient);
		}
		resolve(null);
	    });
	});
    }
};

module.exports = ContactList;
    



