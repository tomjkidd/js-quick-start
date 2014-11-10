'use strict';
define('services/webServiceProxy', ['jquery','q'], function($, Q){
    var stdSuccessHandler = function (dfd, jsendResponse) {
        if(jsendResponse.status == 'success') {
            dfd.resolve(jsendResponse.data);
        } else {
            // Error occurred
            dfd.reject(jsendResponse);
        }
    };
    
    var deferredRestGet = function(url, id) {
        var deferred = Q.defer();
        $.ajax({
            contentType: 'application/json',
            data: {},
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                stdSuccessHandler(deferred, data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                deferred.reject(errorThrown);
            },
            type: 'GET',
            url: url + '/' + encodeURIComponent(id)
        });
        return deferred.promise;
    };

    var deferredGet = function(url, data) {
        var deferred = Q.defer();
        $.ajax({
            contentType: 'application/json',
            data: data,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                stdSuccessHandler(deferred, data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                deferred.reject(errorThrown);
            },
            type: 'GET',
            url: url
        });
        return deferred.promise;
    };
    
    var deferredPost = function(url, data) {
        var deferred = Q.defer();
        $.ajax({
            contentType: 'application/json',
            data: data,
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                stdSuccessHandler(deferred, data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // May want an error toast message and some db logging.
                deferred.reject(errorThrown);
            },
            type: 'POST',
            url: url
        });
        return deferred.promise;
    };
    
    function createUser(jsonParameter) {
        return deferredPost('api/createUser', jsonParameter);
    }
    
    function lookupUser(id) {
        return deferredRestGet('api/lookupUser', id);
    }
    
    var api = {
        createUser: createUser,
        lookupUser: lookupUser
    };
    
    var vm = {
        RestGet: deferredRestGet,
        Get: deferredGet,
        Post: deferredPost,
        api: api
    };
    
    return vm;
});