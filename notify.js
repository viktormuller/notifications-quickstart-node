require('dotenv').load();
var post = require('request').post;

// Twilio User Notifications Service Endpoint
var serviceUrl = 'https://notifications.twilio.com/v1';

// Notifications creation endpoint
var notificationUrl = serviceUrl + '/v1/Services/'
  + process.env.TWILIO_NOTIFICATION_SERVICE_SID + '/Notifications';

// Send a notification 
post(notificationUrl, {
  auth: {
    username: process.env.TWILIO_ACCOUNT_SID,
    password: process.env.TWILIO_AUTH_TOKEN
  },
  form: { 
    Identity: process.argv.slice(2), 
    Body: 'Hello, ' + process.argv.slice(2) + '!'
  }
}, function(err, httpResponse, body) {
  console.log(body);
});
