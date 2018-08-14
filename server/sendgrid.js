
const sendgrid = require("./lib/sendgrid-contacts");

const contact = new sendgrid("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");

const list_id='4707395'; // TT_Test list ID
/*
function getListId() {
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
*/

function addRecipient(email,last_name,first_name,graduate) {

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

var email="aaaa1234.85@gmail.com";
var last_name="Hello";
var first_name="Kitty";

addRecipient(email,last_name,first_name);
//deleteRecipient(email);

function deleteRecipient(email)
{
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

/*
contact.lists.getList(params,function(err,resp) {
	if (err) { return console.error(err); }
	console.log(resp);
    });
*/


/*
contact.recipients.deleteRecipients(ids,function(err,resp) {
    	if (err) { return console.error(err); }
	console.log(resp);
    });
*/
/*
contact.lists.getListRecipients(params,function(err,resp) {
	if (err) { return console.error(err); }
	console.log(resp);
    });
*/
//module.exports = require("./lib/sendgrid-contacts");

