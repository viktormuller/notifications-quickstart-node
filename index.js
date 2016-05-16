var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var env = require('./config.json');
var twilio = require('twilio');

// Create Express Webapp
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Basic health check - check environment variables have been configured
// correctly
app.get('/', function(request, response) {
  response.render('index.jade', {
    TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: env.TWILIO_AUTH_TOKEN,
    TWILIO_NOTIFICATION_SERVICE_SID: env.TWILIO_NOTIFICATION_SERVICE_SID,
    TWILIO_APN_CREDENTIAL_SID: env.TWILIO_APN_CREDENTIAL_SID,
    TWILIO_GCM_CREDENTIAL_SID: env.TWILIO_GCM_CREDENTIAL_SID
  });
});

//Create a binding using device properties
app.post('/register', function(request, response) {
  
  // Authenticate with Twilio
  var client = new twilio(env.TWILIO_ACCOUNT_SID,  env.TWILIO_AUTH_TOKEN);
  
  // Get a reference to the user notification service instance
  var service = client.notifications.v1.services(env.TWILIO_NOTIFICATION_SERVICE_SID);

  service.bindings.create({
    "endpoint": request.body.endpoint,
    "identity": request.body.identity,
    "bindingType": request.body.BindingType,
    "address": request.body.Address
  }).then(function(binding) {
    var message = 'Binding created!';
    console.log(binding);
    // Send a JSON response indicating success
    response.send({
      message: message
    });
  }).catch(function(error) {
    var message = 'Failed to create binding: ' + error;
    console.log(message);
    
    // Send a JSON response indicating an internal server error
    response.status(500).send({
      error: error,
      message: message
    });
  });
});

// Start HTTP server
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Express server running on *:' + port);
});
