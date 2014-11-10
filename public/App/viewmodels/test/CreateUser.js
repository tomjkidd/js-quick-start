'use strict';
define('viewmodels/test/CreateUser', ['knockout', 'services/logger', 'services/webServiceProxy', 'underscore', 'underscore-string',], function(ko, logger, proxy, _){
    var vm = function (element, options) {
        var self = this;
        self.First = ko.observable();
        self.Last = ko.observable();
        
        var jsonParameter = ko.computed(function(){
            var f = _.str.trim(self.First());
            var l = _.str.trim(self.Last());
            
            var jp = {
                User: {
                    First: f,
                    Last: l
                }
            };
            
            return jp;
        });
        
        self.SubmitClickHandler = function() {
            var jp = ko.toJSON(jsonParameter.peek());
            proxy.api.createUser(jp).then(function (data) {
                logger.userMessage('The user has been created.');
            })
            .fail(function(err){
                logger.userErrorMessage('Unable to create the user. <br/>' + ko.toJSON(err));
            }).done();
        };
    };
    return vm;
});