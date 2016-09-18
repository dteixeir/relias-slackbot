var jira = require('../classes/jira.js');
//var mw = require('../classes/middleware.js');

module.exports = function(app, route) {
    // pre route middleware to run
    // app.use('/episode', mw.auth);

    // toggles if the episode has been seen
    app.get("/jira/sprint", function(req, res, next) {
        jira.sprint().then(function(sprint) {
          res.send({status: 200, data: sprint});
        });
    });

    app.get("/jira/issue/:id", function(req, res, next) {
      jira.issue(req.params.id).then(function(issueStatus) {
        res.send({status: 200, data: issueStatus});
      }); 
    });


    // Return middleware ?? per use case stuff?
    return function(req, res, next) {
        next();
    };
};