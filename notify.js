require('dotenv').load();
var request = require('request');

// Send a notification 
request.post(process.env.TWILIO_NOTIFICATION_URL + '/v1/Services/' 
  + process.env.TWILIO_NOTIFICATION_SERVICE_SID + '/Notifications', {
  form:{'Identity': '' + process.argv.slice(2), 'Body': 'Hello ' 
  + process.argv.slice(2)}},
  function callback(err, httpResponse, body) {
    console.log(body);
}).auth(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)