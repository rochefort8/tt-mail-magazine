require('dotenv').config();
const crypto = require('crypto');

//const verification = require('./verification');
const action = require('./action');

//exports.handler = async (event, context) => {
exports.handler = function (event, context) {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    console.log('command =', event.command);
    console.log('param1 =',  event.param1);
    console.log('param2 =',  event.param2);
    console.log('param3 =',  event.param3);
    console.log('param4 =',  event.param4);

    command = event.command ;
    email = event.param1 ;
    key = event.param1;
    last_name = event.param2
    first_name=event.param3 ;

    switch (command) {
    case "add":
	action.doProvisionalRegistration(email,last_name,first_name);
	break;

    case "verification":
	action.doRegistration(key);
	break;
	
    case "delete":
	action.doRemove(email);
	break;

    default:
	break;
    }
    return event.key1;  // Echo back the first key value
};

