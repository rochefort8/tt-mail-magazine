
function asyncFunction() {

    // Promiseオブジェクトを返却する.処理成功時にはresolveが呼ばれる
    return new Promise(function (resolve, reject) {
	    setTimeout(function () {
		    resolve('Async Hello world');
		}, 2000);
    });

}

asyncFunction().then(function (value) {
	console.log(value);    // => 'Async Hello world'
    }).catch(function (error) {
	    console.log(error);
	});