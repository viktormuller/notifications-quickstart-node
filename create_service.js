var post = require('request').post;
var env = require('./config.json');

// Twilio User Notifications Service Endpoint
var servicesUrl = 'https://notifications.twilio.com/v1/Services';

// Create a notifications service instance
request.post(servicesUrl, {
  auth: {
    username: env.TWILIO_ACCOUNT_SID,
    password: env.TWILIO_AUTH_TOKEN
  },
  form: {
    FriendlyName: 'My First Notifications App', 
    ApnCredentialSid: env.TWILIO_CREDENTIAL_SID
  }
}, function(err, httpResponse, body) {
  console.log(JSON.parse(httpResponse.body).sid);
});
