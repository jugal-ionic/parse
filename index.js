// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseDashboard = require('parse-dashboard');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var api = new ParseServer({
  databaseURI:  'mongodb://localhost:27017/dev',
  cloud:  __dirname + '/cloud/main.js',
  appId: 'EwDTpTzNekoca5yA7VUW6I6gdbS2Y4sOBJ2NitMq',
  masterKey:  'tufy1ADCME9NwRKWQTjDZnrIX8QAcx481BeDJPfm', //Add your master key here. Keep it secret!
  serverURL:'http://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();
var dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": "http://localhost:1337/parse",
      "appId": "EwDTpTzNekoca5yA7VUW6I6gdbS2Y4sOBJ2NitMq",
      "masterKey": "tufy1ADCME9NwRKWQTjDZnrIX8QAcx481BeDJPfm",
      "appName": "MyApp"
    }
  ],
"users": [
    {
      "user":"user1",
      "pass":"pass"
    },
    {
      "user":"user2",
      "pass":"pass"
    }
  ]
});
// make the Parse Dashboard available at /dashboard
app.use('/dashboard', dashboard);
// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = '/parse';
console.log(api.cloud);
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('Make sure to star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port =  1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
