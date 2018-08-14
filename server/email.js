
const config = require('../config');
const sendgrid   = require('sendgrid')(config.email.apiKey);
const email      = new sendgrid.Email();
const emailToAdmin      = new sendgrid.Email();
const adminEmailAddress = config.admin.email;

function send(sendTo,toWhom) {
	var from       = "tt-official@tochikukai.com";

	email.setTos(sendTo);
	email.setFrom(from);
	email.fromname = '東京東筑会';
	email.setSubject('D');
	email.setText('D');
	email.setHtml('<strong> </strong>');
        email.addSubstitution('%toWhom%', toWhom);
        email.addSubstitution('%fiscal-year%', '2018');
	email.addFilter('templates','template_id','1a518d33-e38f-472f-a5f3-451f2b658a57');

	sendgrid.send(email, function(err, json) {
		if (err) { return console.error(err); }
		console.log(json);
    });
}

send("hoegaarden1917@gmail.com","OGI");

