require('dotenv').load();
var request = require('request');

request.post(process.env.TWILIO_NOTIFICATION_URL + '/v1/Services', {
  form:{'FriendlyName': 'FRIENDLY_NAME', 'ApnCredentialSid':process.env.TWILIO_CREDENTIAL_SID}},
  function callback(err, httpResponse, body) {
    console.log(JSON.parse(httpResponse.body).sid)
}).auth(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)