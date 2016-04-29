var 	express 	= require('express'),
 	app 		= express(),
 	bodyParser 	= require('body-parser'),
	request 	= require('request'),
	http 		= require('http'),
 	querystring 	= require('querystring');

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
	var config = {};
	config.liquidplanner = {
		'email'   : 'ehealthoncall@gmail.com',
		'pass'    : 'oeipeanutbutterandjelly40',
		'spaceId' : 85533,
		'apiPath' : 'app.liquidplanner.com/api/workspaces/'
	};

	var url = "https://" + config.liquidplanner.email + ":" + config.liquidplanner.pass + "@" + config.liquidplanner.apiPath + config.liquidplanner.spaceId + "/tasks/" + taskID + "/"; 
	console.log(url);
	var data = {
		"id": taskID,
		"assignments": [
		{
			"low_effort_remaining": 0.1,
			"high_effort_remaining": 1
		}
			]
	};
	request(
	    { 	method: 'PUT', 
        		uri: url, 
        		multipart:
	      [ { 'content-type': 'application/json',  
           	body: JSON.stringify(data)
	        }
	      ]
	    },
	    function (error, response, body) {
	      if(!error && response.statusCode == 200){
	        console.log('PUT request was successful');
	      } else {
	        console.log('error: '+ response.statusCode);
	        console.log(body);
	      }
	    }
	  );


}

//https://app.liquidplanner.com/api/workspaces//tasks/:id/
