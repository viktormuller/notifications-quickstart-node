# Notifications Quickstart for Node.js

This application should give you a ready-made starting point for integrating notifications into your
own apps with Twilio Notifications. Before we begin, we need to collect
all the credentials we need to run the application:

Credential | Description
---------- | -----------
Twilio Account SID | Your main Twilio account identifier - [find it on your dashboard](https://www.twilio.com/user/account/settings).
Twilio Credential SID | Adds notification ability to your app - [generate one here](https://www.twilio.com/user/account/ip-messaging/credentials). You'll need to provision your APN push credentials to generate this. See [this](https://www.twilio.com/docs/api/ip-messaging/guides/push-notifications-ios) guide on how to do that.
Twilio Notification URL | The base URL for the Notifications API -- `https://notifications.twilio.com`
Twilio Notification_Service SID | Use the create_service.js script to generate this. Just run 'node create_service.js' in your terminal.

# Setting up the Node.js Application

Create a configuration file for your application:

```bash
cp .env.example .env
```

Edit `.env` with the four configuration parameters we gathered from above.

Next, we need to install our dependencies from npm:

```bash
npm install
```

Now we should be all set! Run the application using the `npm` command.

```bash
npm start
```

Your application should now be running at [http://localhost:3000](http://localhost:3000). 

# Usage

When your app receives a 'registration' in the form of a POST request to the /register endpoint from a mobile client, it will create a binding. A binding is the address Twilio gives your app installation. It lets our service know where to send notifications.  

To send a notification to the client run the notify script 

```bash
  node notify IDENTITY_HERE
```

The mobile client will receive a notification with the hardcoded 'Hello Bob' message.

That's it! Check out our REST API [docs](http://www.local.twilio.com/docs/api/notifications/rest/overview) for more information on Twilio Notifications.

## License

MIT
