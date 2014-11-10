'use strict';
define('viewmodels/test/example', ['jquery','underscore','q','moment'], function ($, _, Q, moment) {
    console.log('loaded viewmodels/test/example');
    
    // Verify that jquery, underscore, q, and moment are all working.
    $.each([1,2,3], function(i,e){
        console.log(e);
    });
    
    _.each(_.map([1, 2, 3], function(num){ return num * num; }), function(e){ console.log(e); });
    
    Q.fcall(function() { return [1,2,3]; }).then(function(xs) {
        console.log('Async call in Q');
        _.each(xs, function (e) { console.log(e * 10); });
    });
    
    console.log(moment());
    
    var vm = {
        foo: 1,
        bar: 2
    };
    return vm;
});