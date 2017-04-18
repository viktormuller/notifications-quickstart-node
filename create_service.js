var env = require('./config.js');
var twilio = require('twilio');

// Authenticate with Twilio
var client = new twilio(env.TWILIO_ACCOUNT_SID,  env.TWILIO_AUTH_TOKEN);

// Create a user notification service instance
var serviceData = {
  friendlyName: 'My First Notifications App'
}

client.notify.v1.services.create(serviceData).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.log(error);
});
