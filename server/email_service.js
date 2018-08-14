
const sendgrid = require("./lib/sendgrid-contacts");

var EmailService = function (apiKey) {
    if (!(this instanceof EmailService)) {
	return new EmailService(apiKey);
    }

    if (typeof apiKey === 'string') {
	// Username and password
	this.api_key = apiKey;
    } else {
	// Won't be thrown?
	throw new Error('Need a username + password or api key!');
    }

    const contact = new sendgrid(apiKey);
    const list_id='4707395'; // TT_Test list ID
    
    this.getListId  = function() {
	contact.lists.getAllLists(function(err,resp,body) {
	    if (err) { return console.error(err); }
	    for(var i = 0; i < resp.lists.length; i++){
		list=resp.lists[i];

		if (list.name == 'TT_Test') {
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
	    last_name  : last_name
	}];

	console.log(recipients[0].email);
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
	var params = {
	    list_id : list_id,
	};

	contact.lists.getListRecipients(params,function(err,resp) {
	    if (err) { return console.error(err); }
	    recipients = resp.recipients ;

	    for(var i = 0; i < recipients.length; i++){
		recipient =  recipients[i] ;
		if (email == recipient.email) {
		    var ids = [recipient.id];
		    console.log('Removing ' + email + '.id=' + recipient.id);		
		    contact.recipients.deleteRecipients(ids,function(err,resp) {
			if (err) { return console.error(err); }
			console.log(resp);
		    });
		}
	    }
	    return null;
	});
    }

    this.queryRecipient = async function(email) {
	var params = {
	    list_id : list_id,
	};
	var res=null;

	return new Promise(function (resolve,reject) {

	contact.lists.getListRecipients(params,function(err,resp) {

		if (err) { 
		    return console.error(err); 
		}
		if (resp.recipient_count == 0) {
		    resolve(null);
		    return ;
		}
		const recipients = resp.recipients ;
		for(var i = 0; i < recipients.length; i++){
		    recipient =  recipients[i] ;
		    if (email == recipient.email) {
			resolve(recipient);
			console.log(recipient);
			return;
		    }
		}
		resolve(null);
	    });
	});
    }
};

module.exports = EmailService;
    



