'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var VerificationEmail = function() {
    if (!(this instanceof VerificationEmail)) {
	return new VerificationEmail(params);
    }


    var ses = new AWS.SES();

    this.send = function(email,name,url) {
	var params = {
	    Destination: {
		ToAddresses: [ email ]
	    },
	    Message: {
		Body: {
		    Text: {
			Data: name + ' /こんにちは/ ' + url,
			Charset: 'utf-8'
		    }
		},
		Subject: {
		    Data: 'こんにちは',
		    Charset: 'utf-8'
		}
	    },
	    Source: 'yuji.ogihara.85@gmail.com' // From
	} ;
	ses.sendEmail(params, function(err, data) {
		console.log("H");
		if (err) console.log(err, err.stack); // an error occurred
		else     console.log(data);           // successful response
	    });
    }
};

module.exports = VerificationEmail ;





