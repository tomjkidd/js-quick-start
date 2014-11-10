'use strict';
define('viewmodels/test/LookupUser', ['knockout', 'services/logger', 'services/webServiceProxy', 'underscore', 'underscore-string',], function(ko, logger, proxy, _){
    var vm = function (element, options) {
        var self = this;
        self.UserId = ko.observable();
        self.LookupMsg = ko.observable('');
        self.Found = ko.observable(undefined);

        self.BgClass = ko.computed(function(){
            var f = self.Found();
            if (f == undefined) {
                return ''
            } else {
                return f ? 'bg-success': 'bg-danger';
            }
        });
        self.IconClass = ko.computed(function(){
            var f = self.Found();
            if (f == undefined) {
                return ''
            } else {
                return f ? 'glyphicon glyphicon-ok-circle': 'glyphicon glyphicon-remove-circle';
            }
        });
        
        self.SubmitClickHandler = function() {
            var uid = _.str.trim(self.UserId.peek());
            proxy.api.lookupUser(uid).then(function (data) {
                if(data.length == 0) {
                    self.Found(false);
                    self.LookupMsg('No User was found with listed User Id.');
                } else {
                    var info = data[0];
                    // Display user info
                    self.Found(true);
                    self.LookupMsg(info.First + ' ' + info.Last + ' was identified by this User Id');
                }
            })
            .fail(function(err){
                logger.userErrorMessage('Unexpected error. ' + ko.toJSON(err));
            }).done();
        };
    };
    return vm;
});