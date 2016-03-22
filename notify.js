var post = require('request').post;
var env = require('./config.json');

// Twilio User Notifications Service Endpoint
var serviceUrl = 'https://notifications.twilio.com';

// Notifications creation endpoint
var notificationUrl = serviceUrl + '/v1/Services/'
  + env.TWILIO_NOTIFICATION_SERVICE_SID + '/Notifications';

// Send a notification 
post(notificationUrl, {
  auth: {
    username: env.TWILIO_ACCOUNT_SID,
    password: env.TWILIO_AUTH_TOKEN
  },
  form: { 
    Identity: '' + process.argv.slice(2), 
    Body: 'Hello, ' + process.argv.slice(2) + '!'
  }
}, function(err, httpResponse, body) {
  console.log(body);
});
