#LiquidPlanner Auto Estimator

##What is does
###Time Estimates
Anytime a task is created/updated, a web hook is sent to the app's designated path.

The app then checks to see if it's a newly created task (change_type === 'create'), and then performs a check to see if the task has a time estimate (is_estimated === false). If both are true, it sends a POST request to the LP API and add's an estimate of 0.1-1hr.
###Auto-Packaging

The app checks to see if the newly created task is from an intake form:

(request.body.name === "TEMPLATE: Bug Fix") >> in this case, the app packages the task in the "Prioritize" package.***
(request.body.name === "TEMPLATE: Urgent Bug Fix") >> in this case, the app packages the task in the "ASAP" package.***

***note that in order to package a task, you must designate a parent_id as well. In both cases, the Project Folder/parent_id is "Know Bugs", or, 21320078.

