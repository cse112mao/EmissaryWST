var SmoochCore = require('smooch-core');


var smooch = new SmoochCore({
	keyId: 'app_593cb499ec86232d00b0901c',
	secret: 'BVADI4RfMSvsxmmyskGbY8op',
	scope: 'app'
});

module.exports.fbMsg = function(payload) {
	var message = payload.messages[0];
	var text = message.text;
	var userId = payload.appUser._id;
	var userFirstName = payload.appUser.givenName;
	var userLastName = payload.appUser.surname;

	//implemented allowing users to make appointment through FB Messenger, other options can be easily implemented similarly
	if (text.includes("make appointment")){
		var aptInfo = text.substr(17);
		//parse information on date/time/provider the user wants, by separating the spaces
		//format expected: make appointment ABC Clinic| Dr.Powell| Wed, 09 Aug 1995 00:00:00| 1234567890
		var splits = aptInfo.split('|');

		//if invalid format, send error msg to user
		if (splits.length < 4){
			smooch.appUsers.sendMessage(userId, {
				type: 'text',
				text: 'The expected format is "make appointment ABC Clinic| Dr.Powell| Wed, 09 Aug 1995 00:00:00| 1234567890"!',
				role: 'appMaker'
			});
		}

		var companyName = splits[0].trim();
		var userProviderName = splits[1].trim();
		var dateString = splits[2].trim();
		var userPhoneNumber = splits[3].trim();

		//make the Date object according to parsed string
		var userDateTime = new Date(Date.parse(dateString));

		var aptReq = {};
		aptReq.body = {
			first_name: userFirstName,
			last_name: userLastName,
			phone_number: userPhoneNumber,
			date: userDateTime,
			company_id: '593ce92538b1f61300922956',
			provider_name: userProviderName
		};
		//create the appointment using API
		var appointmentController = require('./routes/appointment/appointment.controller');
		appointmentController.template.create(aptReq, function(err){
		});
		//send back confirmation response on FB Messenger
		smooch.appUsers.sendMessage(userId, {
			type: 'text',
			text: 'You are making an appointment at '+ companyName + ' with ' + userProviderName + " at " + dateString + '.',
			role: 'appMaker'
		});
	}
};
