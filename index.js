var 	express 	= require('express'),
 	app 		= express(),
 	bodyParser 	= require('body-parser'),
	request 	= require('request');

var jsonParser = bodyParser.json();

//====================
//===EXPRESS=SETUP===
//====================
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


//==========================
//===LIQUIDPLANNER=CONFIG===
//==========================
var config = {};
config.liquidplanner = {
	'email'   : 'YOUR LIQUID PLANNER EMAIL',
	'pass'    : 'YOUR LIQUID PLANNER PASSWORD',
	'spaceId' : YOUR LIQUIDPLANNER WORKSPACEID,
	'apiPath' : 'app.liquidplanner.com/api/workspaces/',
	//THESE PACKAGES AND FOLDERS WILL BE DIFFERENT FOR YOU.
	'prioritizePackageId' : 11759345,
	'asapPackageId' : 31299875,
	'knownBugsFolderId' : 21320078 
};

var baseURL = "https://"
		+ config.liquidplanner.email 
		+ ":" 
		+ config.liquidplanner.pass 
		+ "@" 
		+ config.liquidplanner.apiPath 
		+ config.liquidplanner.spaceId 
		+ "/tasks/";

//=============================================
//===LISTEN=FOR=WEBHOOK=AND=PERFORM=LOGIC===
//=============================================

app.post('/liquid-task', jsonParser, function (request, response) {
	response.sendStatus(200);
	if (request.body.change_type === "create") {
		if (request.body.name === "TEMPLATE: Bug Fix") {
			console.log(request.body.id + " needs to be packaged, let me take care of that for you.");
			packageMe(request.body.id, config.liquidplanner.prioritizePackageId);
		} else if (request.body.name === "TEMPLATE: Urgent Bug Fix") {
			console.log(request.body.id + " is URGENT and needs to be packaged, let me take care of that for you.");
			packageMe(request.body.id, config.liquidplanner.asapPackageId);
		} else if (request.body.is_estimated === false) {
			console.log(request.body.id + " has no time estimate! Let's fix that...");
			addEstimate(request.body.id,request.body.assignments[0].id);
		}
	} else if (request.body.change_type === "update") {
		if (request.body.is_estimated === false && request.body.is_done === false) {
			console.log(request.body.id + " has no time estimate! Let's fix that...");
			addEstimate(request.body.id,request.body.assignments[0].id);
		} 
	}
});

//=======================
//===ADD=TIME=ESTIMATE===
//=======================
function addEstimate(taskId,assId) {

	var url = baseURL
		+ taskId 
		+ "/update_assignment";

	var data = { 
		    "assignment_id": assId,
		    "low_effort_remaining": 0.1,
		    "high_effort_remaining": 1
	};

	var requestMethod = 'POST';

	newHttpRequest(url, data, requestMethod);
}
//===============================
//===PACKAGE=BUG=TASKS=========
//===============================
function packageMe(taskId,packageId) {
	
	var url = baseURL
		+ taskId;

	var data = { 
		"task":
			{
				"package_id": packageId,
		    		"parent_id": config.liquidplanner.knownBugsFolderId
			}
	};

	var requestMethod = 'PUT';

	newHttpRequest(url, data, requestMethod);
}

function newHttpRequest (url, data, requestMethod) {
	 request(
	    { 	
	    	method: requestMethod, 
        		uri: url, 
        		headers: 
        		{ 
        			'Content-Type': 'application/json'
        		},         			
	        	body:JSON.stringify(data)	        		
	    },
	    function (error, response, body) {
	    	if(!error && response.statusCode == 200){
	        		console.log('Request was successful');
	      	} else {
	        		console.log('error: '+ response.statusCode);
	        		console.log(body);
	      	}
	    }
	);
}
