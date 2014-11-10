'use strict';
var scripts = '../Scripts/';
var amd = './amd/';

require.config({
    //baseUrl: '/app/'
    // Tell the application where to find 3rd party libs
    paths: {
        jquery: scripts + 'jquery',
        knockout: scripts + 'knockout',
        underscore: scripts + 'underscore',
        'underscore-string': scripts + 'underscore.string',
        q: scripts + 'q',
        moment: scripts + 'moment',
        toastr: scripts + 'toastr',
        bootstrap: scripts + 'bootstrap',
        koTemplateLoader: amd + 'koTemplateLoader',
    },
    // Setup the template loader
	config: {
		koTemplateLoader: {
			templatePath: 'app',
			extension: '.html'
		}
	},
    shim: {
        'underscore-string': {
            deps: ['underscore']
        }
    }
});

require(['jquery', 'knockout', 'toastr', 'services/webServiceProxy', 'services/logger', 'viewmodels/test/example', 'viewmodels/test/CreateUser', 'viewmodels/test/LookupUser',
    'koTemplateLoader!views/test/example',
    'koTemplateLoader!views/test/CreateUser',
    'koTemplateLoader!views/test/LookupUser',
    'amd/domReady!'], function($, ko, toastr, proxy, logger, Example, CreateUser, LookupUser) {

    var vm = {
        Example: Example,
        CreateUser: new CreateUser(),
        LookupUser: new LookupUser()
    };
    
    ko.applyBindings(vm, $('#pagevm')[0]);
});