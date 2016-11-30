var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var env = require('./config.js');
var twilio = require('twilio');
var FB = require('fb');

// Create Express Webapp
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Basic health check - check environment variables have been configured
// correctly
app.get('/', function(request, response) {

  var config =  {
    TWILIO_ACCOUNT_SID: env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: env.TWILIO_AUTH_TOKEN,
    TWILIO_NOTIFICATION_SERVICE_SID: env.TWILIO_NOTIFICATION_SERVICE_SID,
    FACEBOOK_PAGE_ACCESS_TOKEN: env.FACEBOOK_PAGE_ACCESS_TOKEN
  }

  //Let's check for which environment is your APNS credential configured (development or production).
  new twilio(env.TWILIO_ACCOUNT_SID,  env.TWILIO_AUTH_TOKEN).notify.v1.credentials(env.TWILIO_APN_CREDENTIAL_SID).fetch().then(function (credential){
    config.TWILIO_APN_CREDENTIAL_ENV = credential.sandbox === "False" ? "Production" : "Development",
    response.render('index.jade',config);
  }).catch(function(error){
    //If not configured just render the known config
    response.render('index.jade',config);
  });
});

function createBinding(identity, endpoint, bindingType, address, sandbox, response){
  // Authenticate with Twilio
  var client = new twilio(env.TWILIO_ACCOUNT_SID,  env.TWILIO_AUTH_TOKEN);

  // Get a reference to the user notification service instance
  var service = client.notify.v1.services(env.TWILIO_NOTIFICATION_SERVICE_SID);

  var execCreateBinding = function(){

    service.bindings.create({
      "endpoint": endpoint,
      "identity": identity,
      "bindingType": bindingType,
      "address": address
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

  }

  // For APNS bindings let's check if the app's provisioning profile is aligned
  // with that of the configured certificate.
  // Typically this check is unnecessary and wasteful in production but very
  // useful if you are doing this the first time so we recommend removing it
  // before deploying to production.
  if (bindingType === "apn"){

    service.fetch().then(function(serviceObj){
      return client.notify.v1.credentials(serviceObj.apnCredentialSid).fetch();
    }).then(function(credential){
      if (credential.sandbox !== sandbox){
        var message = "Mismatched APNS certificate. Make sure you are using a production certificate with a production provisioning profile and a development certificate with a development provisioning profile.";
        console.log(message);
        console.log("Credential's sandbox value: " + credential.sandbox);
        console.log("App's sandbox value: " + sandbox);
        response.status(400).send({
          error: "52134",
          message: message
        });
      } else{
        execCreateBinding();
      }
    }).catch(function(error){
      console.log(error);
    });
  } else { //if not APNS binding we can just to ahead and create the Binding
    execCreateBinding();
  }
}

//Create a binding using device properties
app.post('/register', function(request, response) {
  createBinding(request.body.identity, request.body.endpoint, request.body.BindingType, request.body.Address, request.body.Sandbox, response);
});

//Create a facebook-messenger binding based on the authentication webhook from Facebook
app.post('/messenger_auth', function(request, response) {
  //Extract the request received from Facebook
  var message = request.body.entry[0].messaging[0];

  console.log(message);

  //Let's find out the first name of the user so that we can notify him/her using that later
  fb = new FB.Facebook({});
  FB.api('/' + message.sender.id, {access_token: env.FACEBOOK_PAGE_ACCESS_TOKEN}, function(resp){
    var identity = resp.first_name;
    var endpoint = 'FBM@' + identity;
    //Let's create a new facebook-messenger Binding for our user
    createBinding(identity, endpoint, 'facebook-messenger', message.sender.id, response);
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
