/*
 *
 *
 *
 *
 */
'use strict';

const config = require('../config');
const apiKey = config.email.mailgun_apiKey;
const domain = 'sandboxa1d8ed7105c14aec90268d0af5f93b8e.mailgun.org';
const mailgun = require('mailgun-js')({ apiKey, domain })
const utils = require('./utils');
const sendgrid   = require('sendgrid')(config.email.sendgrid_apiKey);
const email      = new sendgrid.Email();

const adminEmailAddress = config.admin.email;

const mail_footer =
'-------------------------------------\n'+
'  東京東筑会・事務局\n'+
'  連絡先 : tt-official@tochikukai.com\n'+
'-------------------------------------';

const body_array = [
		   /* request registration */
'{toWhom}様\n'+
'\n'+
'東京東筑会メールマガジンの配信希望、誠にありがとうございます。\n' +
'下記のURLをクリックいただきますと本登録が完了します。\n' +
'\n'+
'{URL}\n' +
'\n'+
'本メール到着後24時間以内に本登録の手続きを行ってください。\n'+
'本登録の手続きを行わなかった場合は、再度仮登録が必要となります。\n\n',
		   /* registration success */
'東京東筑会メールマガジンのへの登録が完了しました。\n' +
'配信をお楽しみに！\n\n',
		   /* request delete */
'東京東筑会メールマガジンの配信停止は下記のURLよりどうぞ。\n' +
'\n'+
'{URL}\n' +
'\n'+
'本メール到着後24時間以内に停止の手続きを行ってください。\n\n',
		   /* delete success */
'東京東筑会メールマガジンの配信を停止しました。\n' +
'機会がありましたらまたよろしくおねがいいたします。\n\n'
		   ];
const subject_array = [
      'メールマガジン本登録の手続き',
      'メールマガジン登録完了',
      'メールマガジン配信停止の手続き',
      'メールマガジン配信停止'
		       ];

var Email = function() {}

Email.send = function(type,sendTo,toWhom,url) {
    var subject = '';
    var body = '';

    switch (type) {
    case 'registration-request':
	body = body_array[0] ;

	subject = subject_array[0] ;
	break ;
    case 'registration-success':
	body = body_array[1] ;
	subject = subject_array[1] ;
	break ;
    case 'delete-request':
	body = body_array[2] ;
	subject = subject_array[2] ;
	break ;
    case 'delete-success':
	body = body_array[3] ;
	subject = subject_array[3] ;
	break ;
    default:
	console.log('No such type:', + type);
	return ;
    }
    subject = '[東京東筑会]' + subject ;
    if (url != null) {
	body = body.replace(/{URL}/g,url);
    }
    if (toWhom != null) {
	body = body.replace(/{toWhom}/g,toWhom);
    }
    body += mail_footer ;
    return this._send(sendTo,subject,body);
}

/*
Email._send = function(sendTo,subject,body) {
    
    console.log(apiKey);
    const data = {
	from: '東京東筑会 <tt-official@tochikukai.com>',
	to: sendTo,
	subject: subject,
	text: body
    };

    mailgun.messages().send(data, (err, body) => {
	    if (err) { return console.error(err) }
	    console.log(body)
	})
}
*/

Email._send = function(sendTo,subject,body) {
	var from       = "tt-official@tochikukai.com";
	var fiscalYear = utils.getCureentFiscalYear();

	email.setTos(sendTo);
	email.setFrom(from);
	email.fromname = '東京東筑会';
	email.setSubject('D');
	email.setText('D');
	email.setHtml('<strong> </strong>');
//	email.addSubstitution('%toWhom%', toWhom);
	email.addSubstitution('%fiscal-year%', fiscalYear);
	email.addSubstitution('%subject%', subject);
	email.addSubstitution('%body%', body);

	email.addFilter('templates','template_id','be6f86db-d13c-43df-953a-4e1f12afce3f');

	sendgrid.send(email, function(err, json) {
		if (err) { return console.error(err); }
		console.log(json);
    });
}

Email.sendToAdmin = function(toWhom,email,phone,address) {

}

module.exports = Email;
