var config = require('./config/config.js');

module.exports.sendSms = function(to, message) {
	var client = require('twilio')(config.twilio_accountSid, config.twilio_authToken);
	if (to === 'COMPANY_PHONE') {
		to = '6264768756';
	}
	client.messages.create({ 
		to: to, 
		from: config.twilio_sendingNumber, 
		body: message
	}, function(err, message) { 
	});
};

module.exports.voiceCall = function(to) {
	var client = require('twilio')(config.twilio_accountSid, config.twilio_authToken);
	client.calls.create({
		url: "http://demo.twilio.com/docs/voice.xml",
		to: to,
		from: config.twilio_sendingNumber
	}, function(err, call) {
	});
};