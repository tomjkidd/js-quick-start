var Q = require('q');
var sqlite3 = require('sqlite3').verbose();
var qb = require('./queryBuilder');

// TODO: Put the connection string into a config object or file.
var dbconnectionString = 'db/exampleapp.sqlite';
function dbContext() {
    return new sqlite3.Database(dbconnectionString);
};
var noop = function () { return; };

/*
 * A couple of deferred wrappers are defined here to make it so that
 * when the sqlite3 library is used, all queries can be made in series
 * without having to go through the trouble to nest callbacks.
 * (db.serialize only works for db.run, not db.each or db.all)
 */
function deferredRun (db, sql, param) {
    var deferred = Q.defer();
    
    db.run(sql, param, function (err){
        if (err) {
            deferred.reject({ status: "error", data: err });
        } else {
            /* `this` contains sql, lastID, and changes properties.
             * 1. lastID can be used for INSERTs so you don't have to 
             *   query the table you just inserted into.
             * 2. changes can be used for UPDATEs and DELETEs. Haven't used
             *   this yet.      
             * https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback
             */
            deferred.resolve(this);
        }
    });
    
    return deferred.promise;
};

function deferredAll (db, sql, param) {
    var deferred = Q.defer();
    
    db.all(sql, param, function (err, rows) {
        if (err) {
            deferred.reject({ status: "error", data: err });
        } else {
            deferred.resolve({ status: "success", data: rows });
        }
    });
    
    return deferred.promise;
};

/* 
 * The init function prepares the database with the tables that it needs
 * to support the application.
 */
function init() {
    var createUserQuery = 
        'CREATE TABLE IF NOT EXISTS User ( \
            UserId INTEGER PRIMARY KEY ON CONFLICT ROLLBACK, \
            First TEXT NOT NULL, \
            Last TEXT NOT NULL, \
            UNIQUE(First, Last) ON CONFLICT ROLLBACK \
        )';
    
    var db = dbContext();

    // Ensure User table is created
    deferredRun(db, createUserQuery, {})
        //Uncomment if more statements need to be added...
        /*.then(function(){
            return deferredRun(db, nextQuery, {})
        })*/
        .fin(function(){
            db.close();
        }).done();
};

function createUser (u, callback) {
    var insertUserQuery =
        'INSERT OR ROLLBACK INTO User (First, Last) \
         VALUES ($first, $last)';
        
    var userParam = {
        $first: u.First,
        $last: u.Last
    };
    
    var $uid;
    var db = dbContext();
    
    //console.log('Starting transaction.');
    deferredRun(db, 'BEGIN TRANSACTION')
        .then(function(){
            return deferredRun(db, insertUserQuery, userParam);
        })
        .then(function(runResult){
            $uid = runResult.lastID;
            return Q.fcall(function(){ return; });
        })
        .then(function(){
            return deferredRun(db, 'COMMIT TRANSACTION');
        })
        .then(function(){
            //console.log('Committed transaction.');
            callback({ 
                status: 'success',
                data : { UserId: $uid }
            });
            return Q.fcall(noop);
        })
        .fail(function(err){
            //console.log('Rolled back transaction.');
            callback(err);
        })
        .fin(function(){
            db.close();
        }).done()
};

function lookupUser (id, callback) {
    var getUserQuery = 
        qb.From('User').Where('UserId = $userId').Select('UserId, First, Last').toSql();

    var db = dbContext();
    deferredAll(db, getUserQuery, { $userId: id })
        .then(function(result) {
            var rows = result.data;
            callback({ status: 'success', data: rows });
        })
        .fail(function(err){
            callback(err);
        })
        .fin(function(){
            db.close();
        }).done();
};

module.exports = {
    dbContext: dbContext,
    run: deferredRun,
    all: deferredAll,
    init: init,
    createUser: createUser,
    lookupUser: lookupUser
};