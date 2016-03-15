require('dotenv').load();
var express = require('express');
var app = express();
var util = require('util');
var bodyParser = require('body-parser');
var request = require('request');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.set('port', (process.env.PORT || 3000));

app.get('/', function(request, response) {
  response.send('index page');
});

//Create a binding using device properties
app.post('/register', function(req, response) {
  request.post(process.env.TWILIO_NOTIFICATION_URL + '/v1/Services/' 
    + process.env.TWILIO_NOTIFICATION_SERVICE_SID + '/Bindings', {
    form:{'Endpoint': req.body.endpoint, 'Identity': req.body.identity,
    'BindingType':req.body.BindingType,'Address':req.body.Address}},
    function callback(err, httpResponse, body) {
      console.log(body);
    }).auth(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
});

app.listen(app.get('port'), function() {
  console.log('Node app is running at localhost:' + app.get('port'))
});
