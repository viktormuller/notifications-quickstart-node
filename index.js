var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var env = require('./config.js');
var twilio = require('twilio');

// Authenticate with Twilio
var client = new twilio(env.TWILIO_ACCOUNT_SID,  env.TWILIO_AUTH_TOKEN);

// Get a reference to the user notification service instance
var service = client.notify.v1.services(env.TWILIO_NOTIFICATION_SERVICE_SID);

// Create Express Webapp
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Basic health check - check environment variables have been configured
// correctly
app.get('/', function(request, response) {
  response.render('index.jade', {
    TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: env.TWILIO_AUTH_TOKEN,
    TWILIO_NOTIFICATION_SERVICE_SID: env.TWILIO_NOTIFICATION_SERVICE_SID,
    TWILIO_APN_CREDENTIAL_SID: env.TWILIO_APN_CREDENTIAL_SID,
    TWILIO_GCM_CREDENTIAL_SID: env.TWILIO_GCM_CREDENTIAL_SID,
    FACEBOOK_PAGE_ACCESS_TOKEN: env.FACEBOOK_PAGE_ACCESS_TOKEN
  });
});

//Create a binding using device properties
app.post('/register', function(request, response) {

  service.bindings.create({
    "endpoint": request.body.endpoint,
    "identity":  request.body.identity,
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

//Create a facebook-messenger binding based on the authentication webhook from Facebook
app.post('/messenger_auth', function(request, response) {

  response.status(200).send();
  //Extract the request received from Facebook
  var message = request.body.entry[0].messaging[0];

  console.log(message);

  var identity = message.sender.id;
  var endpoint = 'FBM@' + identity;
  //Let's create a new facebook-messenger Binding for our user
  service.bindings.create({
    "endpoint": endpoint,
    "identity": identity,
    "bindingType": 'facebook-messenger',
    "address": identity
  }).then(function(binding) {
    console.log(binding);
  }).catch(function(error) {
    var message = 'Failed to create binding: ' + error;
    console.log(message);
  });
});

//Verification endpoint for Facebook needed to register a webhook.
app.get('/messenger_auth', function(request, response) {
  console.log(request.query["hub.challenge"]);
  response.send(request.query["hub.challenge"]);
});



// Start HTTP server
var server = http.createServer(app);
var port = process.env.PORT || 3000;
server.listen(port, function() {
  console.log('Express server running on *:' + port);
});
