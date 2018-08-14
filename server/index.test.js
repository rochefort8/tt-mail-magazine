const lambda = require('./index.js');
const context = "";

var event = {
    command : process.argv[2],
    param1  : process.argv[3],    
    param2  : process.argv[4],
    param3  : process.argv[5],    
    param4  : process.argv[6]
};

function callback(error, result) {
    if (typeof error !== 'null') {
	console.error(result);
	process.exit(1);
    }
    console.log(result);
    process.exit(0);
}
lambda.handler(event, context, callback);
