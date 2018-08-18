

    this.getListId  = function() {
	contact.lists.getAllLists(function(err,resp,body) {
	    if (err) { return console.error(err); }
	    for(var i = 0; i < resp.lists.length; i++){
		list=resp.lists[i];

		//		if (list.name == 'TT_Test') {
		if (list.name == 'tt-mail-magazine') {
		    console.log(list.id);
		    return list.id ;
		}
	    }
	    return null;
	});
    }

    this.addRecipient = function(email,last_name,first_name,graduate) {

	var recipients = [{

module.exports = EmailService;
    



