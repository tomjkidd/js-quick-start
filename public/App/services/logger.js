'use strict';
define('services/logger', ['toastr'], function(toastr){
    return {
        userMessage: function (msg) {
            toastr.info(msg);
        },
        userErrorMessage: function (msg) {
            toastr.error(msg);
        }
    }
});