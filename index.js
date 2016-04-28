var express = require('express');
var app = express();
var bodyParser = require('body-parser');

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
			console.log(request.body.name + " has no time estimate!");
		}
	}
});


