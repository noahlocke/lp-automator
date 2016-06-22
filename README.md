#LiquidPlanner Auto Estimator

This app is currently hosted on Heroku (don't tell IS) so that it can receive webhooks from LiquidPlanner.

##What is does
###Time Estimates
Anytime a task is created/updated, a web hook is sent to the app's designated path:

https://cryptic-refuge-75349.herokuapp.com/liquid-task

The app then checks to see if it's a newly created task (change_type === 'create'), and then performs a check to see if the task has a time estimate (is_estimated === false). If both are true, it sends a POST request to the LP API and add's an estimate of 0.1-1hr.
###Auto-Packaging

The app checks to see if the newly created task is from an intake form:

(request.body.name === "TEMPLATE: Bug Fix") >> in this case, the app packages the task in the "Prioritize" package.***
(request.body.name === "TEMPLATE: Urgent Bug Fix") >> in this case, the app packages the task in the "ASAP" package.***

***note that in order to package a task, you must designate a parent_id as well. In both cases, the Project Folder/parent_id is "Know Bugs", or, 21320078.

##Things to note:

Until we have a stable environment for running Node.js apps on public-facing servers, I'll keep this running on Heroku for free. 

##Security

The app is currently not very secure. It sends a 200 response to any POST request at /liquid-task, however it does not touch any UW Health systems what-so-ever, so this is a very low-risk application in general. 
