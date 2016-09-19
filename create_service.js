var env = require('./config.js');
var twilio = require('twilio');

// Authenticate with Twilio
var client = new twilio(env.TWILIO_ACCOUNT_SID,  env.TWILIO_AUTH_TOKEN);

// Create a user notification service instance
var serviceData = {
  friendlyName: 'My First Notifications App'
}

if (env.TWILIO_APN_CREDENTIAL_SID != "") {
  serviceData.apnCredentialSid = env.TWILIO_APN_CREDENTIAL_SID
  console.log("Adding APN Credentials to service")
} else {
  console.log("No APN Credentials configured - add in config.js, if available.")
}

if (env.TWILIO_GCM_CREDENTIAL_SID != "") {
  serviceData.gcmCredentialSid = env.TWILIO_GCM_CREDENTIAL_SID
  console.log("Adding GCM Credentials to service")
} else {
  console.log("No GCM Credentials configured - add in config.js, if available.")
}

client.notify.v1.services.create(serviceData).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.log(error);
});
