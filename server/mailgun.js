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

const adminEmailAddress = config.admin.email;

const mail_body = '{toWhom}様\n'+
'\n'+
'東京東筑会メールマガジンの配信希望、誠にありがとうございます。\n' +
'下記のURLをクリックいただきますと本登録が完了します。\n' +
'\n'+
'{URL}\n' +
'\n'+
'本メール到着後24時間日間以内に本登録の手続きを行ってください。\n'+
'本登録の手続きを行わなかった場合は、再度仮登録が必要となります。\n'+
'\n'+
'-------------------------------------\n'+
'  東京東筑会・事務局\n'+
'  連絡先 : tt-official@tochikukai.com\n'+
'-------------------------------------';

var Email = function() {}

Email.send = function(sendTo,toWhom,url) {
    
    var body = mail_body.replace(/{URL}/g,url);
    var body = body.replace(/{toWhom}/g,toWhom);

    console.log(apiKey);
    const data = {
	from: '東京東筑会 <tt-official@tochikukai.com>',
	to: sendTo,
	subject: '[東京東筑会]メールマガジン本登録のご案内',
	text: body
    };
    console.log(data.text);

    mailgun.messages().send(data, (err, body) => {
	    if (err) { return console.error(err) }
	    console.log(body)
	})
}

Email.sendToAdmin = function(toWhom,email,phone,address) {

}

module.exports = Email;
