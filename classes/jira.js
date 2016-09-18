var request = require('request');
var _ = require('lodash');
var config = require('../config.json');
var Q = require('q');


var headers = '';
var body = '';
var sprint = null;

var options = {
    url : config.JIRA_API.SPRINT,
    headers : config.Credentials.Headers.Jira
};

var rootApi = {
    url : config.JIRA_API.ROOT,
    headers : config.Credentials.Headers.Jira
}

// create a bot
// temporary fix until making it an app and using push notifications
var jira = {
  sprints: function() {
    var deferred = Q.defer();

    request(options, function(err, res, body) {
      if (err) {
        deferred.reject(err);
      }

      if (res) {
        var sprints = JSON.parse(body);
        sprints = _.filter(sprints.sprints, {"state" : "ACTIVE"});
        
        if(sprints.length == 1) {
          sprint = sprints;
          console.log(sprint);
          deferred.resolve(sprint);
        }
      }
    });

    return deferred.promise;
  },

  sprint: function() {
    return this.sprints().then(function(data) {
      return data;
    });
  },

  issue: function(id) {
    var deferred = Q.defer();
    rootApi.url = config.JIRA_API.ROOT + 'issue/' + id;

    request(rootApi, function(err, res, body) {
      if (err) {
        deferred.reject(err);
      }

      if (res) { 
        var issue = JSON.parse(body);
        deferred.resolve(issue.fields.status.name);
      }
    });

    return deferred.promise;
  }

}

module.exports = jira;