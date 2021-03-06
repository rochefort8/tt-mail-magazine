/* ========================================================================
 * Payment form with Stripe/Bootstrap : stripe.js
 * ========================================================================
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Yuji Ogihara
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ======================================================================== */
'use strict';

$(document).ready(function(){

	/* Check "registration=.. */
	var action='';
	var key = getParam('registration');
	if (key != null) {
	    action = 'do_registration';
	} else {
	    /* Check "delete=.. */
	    key = getParam('delete');
	    if (key != null) {
		action = 'do_delete';
	    }
	}

	if (key != null) {
	    $('#registration-form').hide();
	    $('#delete-form').hide();
	    startBlockUI();

	    $.post('/command', {
		    'action': action,
		    'key': key
		    })
		// Assign handlers immediately after making the request,
		.done(function(data, textStatus, jqXHR) {
		    var message = loadMessage(action);
		    document.getElementById("thanks-to-body").textContent = message;
		    $('#registration-form').hide();
		    $('#thanks').show();
		    stopBlockUI();
		})
	    .fail(function(jqXHR, textStatus, errorThrown) {
		    var errorType = 'Error type : ' + jqXHR.responseJSON.type + '\n'; 
		    var errorMessage = 'Message : ' + jqXHR.responseJSON.message;
		    if (action == 'do_registration') {
			alert('登録できませんでした。お手数ですが仮登録から行ってください。');
		    } else {
			alert('解除できませんでした。お手数ですが フォーム入力から行ってください。');
		    }
		    $('#thanks').hide();
		    $('#registration-form').show();
		    $('#delete-form').show();
		    stopBlockUI();
		});
	}

	AWS.config.update({
		"accessKeyId": "",
		"secretAccessKey": "",
		"region": "ap-northeast-1"
		    });
	var lambda = new AWS.Lambda();
	onSubmit(lambda);
	onSubmitDelete(lambda);
});

/**
 * Get the URL parameter value
 *
 * @param  name {string} パラメータのキー文字列
 * @return  url {url} 対象のURL文字列（任意）
 */
function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function onSubmit(lambda) {

    /* Provisional registration */
    $('#submit').on('click', function(e){
        e.preventDefault();

	var name_kanji_family = $('#name_kanji_family').val() ;
	var name_kanji_given = $('#name_kanji_given').val() ;
	var name_kana_family = $('#name_kana_family').val() ;
	var name_kana_given = $('#name_kana_given').val() ;
	var fullname      = name_kanji_family + ' ' + name_kanji_given ;
	var fullname_kana = name_kana_family  + ' ' + name_kana_given ;
	var graduate = $('#graduate').val() ;
	var email = $('#email').val() ;
	var thanksTo= graduate + '期' + ' ' + name_kanji_family + name_kanji_given + ' 様' ;
	document.getElementById("thanks-to").textContent=thanksTo;

	var params = {
	    FunctionName:"tt-mail-magazine",
	    InvocationType:"RequestResponse",
	    Payload : JSON.stringify({
		    "command":"add",
		    "param1": email,
		    "param2": name_kanji_family,
		    "param3": name_kanji_given,		    
		    "param4": graduate,
		    "key1" : email
		})
	};
	startBlockUI();

	$.post('/command', {
		    'action': 'request_registration',
		    'key': '',
		    'email': email,
		    'graduate': graduate,
		    "last_name": name_kanji_family,
		    "first_name": name_kanji_given,	
		    })

	    // Assign handlers immediately after making the request,
	    .done(function(data, textStatus, jqXHR) {

		    $('#registration-form').hide();
		    $('#delete-form').hide();

		    var message = '';
		    if (data.message == 'new') {
			message = loadMessage('registration-new');
		    }
		    if (data.message == 'data-exists') {
			message = loadMessage('registration-data-exists');
		    }
		    message = message.replace(/{MAIL_ADDRESS}/g,email);
		    document.getElementById("thanks-to-body").textContent = message;
		    $('#thanks').show();
		    stopBlockUI();
		})
	    .fail(function(jqXHR, textStatus, errorThrown) {

		    var errorType = 'Error type : ' + jqXHR.responseJSON.type + '\n'; 
		    var errorMessage = 'Message : ' + jqXHR.responseJSON.message;
		    alert('支払いできませんでした。' + '\n' + errorType + errorMessage) ;
		    stopBlockUI();
		});

	/*
	lambda.invoke( params,function(err,data) {
		if(err) console.log(err,err.stack);
		else console.log(data);
	    });
	*/
    });
}


function loadMessage(type) {

    var ret = null;
    var message_array = [
		   '東京東筑会メールマガジンの配信希望、誠にありがとうございます。' +
		   '宛先"{MAIL_ADDRESS}"に本登録のためのメールを送信しました。' +
		   'ご確認いただき、本登録を行ってください。'+
		   'なお、メールが受信されない場合は、入力いただいたメールアドレス、もしくは' +
		   'メールの受信設定をご確認ください。',

		   'メールアドレス"{MAIL_ADDRESS}"はすでにメルマガの配信先として登録されています。' +
		   '配信をぜひお楽しみに！',

		   '登録が完了しました。配信をぜひお楽しみに！',

		   '宛先"{MAIL_ADDRESS}"に手続きのためのメールを送信しました。' +
		   'ご登録の解除を行ってください。',

		   'メールアドレス"{MAIL_ADDRESS}"の登録はありませんでした。',

		   '登録を解除しました。機会があればまたぜひよろしくお願いします！'

			   ];
    switch (type) {
    case 'registration-new':
	ret = message_array[0] ;
	break ;
    case 'registration-data-exists':
	ret = message_array[1] ;
	break ;
    case 'do_registration':
	ret = message_array[2] ;
	break ;
    case 'delete-new':
	ret = message_array[3] ;
	break ;
    case 'delete-data-nonexist':
	ret = message_array[4] ;
	break ;
    case 'do_delete':
	ret = message_array[5] ;
	break ;
    default:
	break;
    }
    return ret ;
}

function onSubmitDelete(lambda) {

    /* Delete */
    $('#submit-r').on('click', function(e){
        e.preventDefault();

	var email = $('#email2').val() ;

	startBlockUI();

	$.post('/command', {
		'action': 'request_delete',
		    'email': email,
		    })

	    // Assign handlers immediately after making the request,
	    .done(function(data, textStatus, jqXHR) {

		    $('#registration-form').hide();
		    $('#delete-form').hide();

		    var message = '';
		    if (data.message == 'new') {
			message = loadMessage('delete-new');
		    }
		    if (data.message == 'data-nonexist') {
			message = loadMessage('delete-data-nonexist');
		    }
		    message = message.replace(/{MAIL_ADDRESS}/g,email);
		    document.getElementById("thanks-to-body").textContent = message;
		    $('#thanks').show();
		    stopBlockUI();
		})
	    .fail(function(jqXHR, textStatus, errorThrown) {
		    stopBlockUI();
		    //			    var errorType = 'Error type : ' + jqXHR.responseJSON.type + '\n'; 
		    //			    var errorMessage = 'Message : ' + jqXHR.responseJSON.message;
		    //			    alert('支払いできませんでした。' + '\n' + errorType + errorMessage) ;
		});

	/*
	lambda.invoke( params,function(err,data) {
		if(err) console.log(err,err.stack);
		else console.log(data);
	    });
	*/
    });
}

function startBlockUI() {
    $.blockUI({ css: { 
		border: 'none', 
		    padding: '15px',
		    backgroundColor: 'none',
		    color: '#333', 
		    '-webkit-border-radius': '10px', 
		    '-moz-border-radius': '10px', 
		    opacity: .8 
		    },
		message: $('#tallContent')} 
	);
}

function stopBlockUI() {
	$.unblockUI();
}





