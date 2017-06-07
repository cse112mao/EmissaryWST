/**
 * Config var for app
 **/
module.exports = {
  mongoDBUrl: 'mongodb://cse112mao:teammao123@ds137891.mlab.com:37891/maoproj',
  port: process.env.PORT || 4941,
  secret: process.env.SECRET || 'mysecret',
	twilio_accountSid: 'AC1ee4060df618c101a0c8893bbd9bd06a',
	twilio_authToken: '677a4198d890ee4c92671804a8ffa26d',
	twilio_sendingNumber: '14243583260'
};

