var http = require('http');
var express = require('express');
var util = require('util');
var bodyParser = require('body-parser');
var post = require('request').post;
var env = require('./config.json');

// Twilio User Notifications Service Endpoint
var notificationsUrl = 'https://notifications.twilio.com/v1';

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
    TWILIO_CREDENTIAL_SID: env.TWILIO_CREDENTIAL_SID
  });
});

//Create a binding using device properties
app.post('/register', function(request, response) {
  var bindingsUrl = notificationsUrl + '/Services/' 
    + env.TWILIO_NOTIFICATION_SERVICE_SID + '/Bindings';

  // Create a device binding for the connecting client
  post(bindingsUrl, {
    auth: {
      username: env.TWILIO_ACCOUNT_SID,
      password: env.TWILIO_AUTH_TOKEN
    },
    form: {
      Endpoint: request.body.endpoint, 
      Identity: request.body.identity,
      BindingType: request.body.BindingType,
      Address: request.body.Address
    }
  }, function(err, httpResponse, body) {
    var message = 'Binding created!';
    if (err) {
      message = 'Failed to create binding.'
      console.log(message);
      console.log(err);
    }

    // Send a JSON response indicating success or failure
    response.send({
      success: err,
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
