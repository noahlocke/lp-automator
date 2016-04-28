var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var http = require('http');
var querystring = require('querystring');

var jsonParser = bodyParser.json();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.post('/liquid-task', jsonParser, function (request, response) {
	response.sendStatus(200);
	if (request.body.change_type === "create") {
		if (request.body.is_estimated === false) {
			console.log(request.body.id + " has no time estimate! Let's fix that...");
			addEstimate(request.body.id);

		}
	}
});

function addEstimate(taskID) {
	
	var data = querystring.stringify({
	      username: "nlocke@uwhealth.org",
	      password: "N0@h1Tyler23"
	    });

	var options = {
	    host: 'requestbin.herokuapp.com',
	    port: 443,
	    path: '/wkryaewk',
	    method: 'POST',
	    headers: {
	        'Content-Type': 'application/x-www-form-urlencoded',
	        'Content-Length': Buffer.byteLength(data)
	    }
	};

	var req = http.request(options, function(res) {
	    res.setEncoding('utf8');
	    res.on('data', function (chunk) {
	        console.log("body: " + chunk);
	    });
	});

	req.write(data);
	req.end();
}

//https://app.liquidplanner.com/api/workspaces//tasks/:id/track_time
