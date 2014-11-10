/*
 * The purpose of this module is to provide a simple programmatic way
 * to compose simple select queries, so that the raw queries or all of 
 * the different variations of a query don't have to be hard coded into
 * the application.
 *
 * The find function is exported and does all of the work.
 */

/*
 * This utility function allows for the argument to be either a string
 * or an array of strings. This makes it easy to use multiple forms of
 * input.
 */
function pushOneOrMany (array, oneOrMany) {
    if (typeof oneOrMany == 'string') {
        array.push(oneOrMany);
    } else if (oneOrMany.length) {
        for(var i = 0; i < oneOrMany.length; i++) {
            array.push(oneOrMany[i]);
        }
    }
    return array;
};

/*
 * The from function's purpose is to all for sql queries to be composed
 * with a specific table as the anchor for the query.
 *
 * The functions where, select, and join allow the select statement to
 * be built through chaining. Call order does not matter.
 *
 * The toSql function allows the composition to be turned into a SQL
 * SELECT query.
 */ 
var from = From = function (tableName) {
    console.log('in from')
    return new SelectQueryBuilder(tableName);
};

function SelectQueryBuilder(tableName) {
    this._tableName = tableName;
    this._whereClauses = [];
    this._columnNames = [];
    
    this._joinTableNames = [];
    this._joinOnClauses = [];
};

var proto = SelectQueryBuilder.prototype;

proto.where = proto.Where = function (clauses) {
    this._whereClauses = pushOneOrMany(this._whereClauses, clauses);
    return this;
};

proto.select = proto.Select = function (columns) {
    this._columnNames = pushOneOrMany(this._columnNames, columns);
    return this;
};

proto.join = proto.Join = function (tableName, onClauses) {
    this._joinTableNames.push(tableName);
    this._joinOnClauses.push(pushOneOrMany([], onClauses));
    return this;
};

proto.toSql = function () {
    if (this._columnNames.length == 0) {
        this._columnNames = ['*'];
    }
    
    var q = 'SELECT ' + this._columnNames.join(', ');
    
    q += ' FROM ' + this._tableName;
    
    if (this._joinTableNames.length > 0) {
        for (var i = 0; i < this._joinTableNames.length; i++) {
            q += ' JOIN ' + this._joinTableNames[i] + ' ON ' + this._joinOnClauses[i].join(' AND ');
        }
    }
    
    if (this._whereClauses.length > 0) {
        q += ' WHERE ' + this._whereClauses.join(' AND ');
    }
    
    return q;
};

// Example usage:
/*
var target = 'SELECT UserId, BeaconId \
         FROM UserBeacon \
         WHERE BeaconId = $beaconId'
         
var target2 = 'SELECT ub.UserId, ub.BeaconId, b.Uid, u.First, u.Last FROM UserBeacon ub \
        JOIN Beacon b ON b.BeaconId = ub.BeaconId \
        JOIN User u ON u.UserId = ub.UserId \
        WHERE b.Uid = $beaconUid';

var q1 = from('user u')
    .where(['u.First = $first','u.Last = $last'])
    .select(['u.First', 'u.Last', 'u.UserId'])
    .toSql();
var t1 = from('UserBeacon')
    .where('BeaconId = $beaconId')
    .select(['UserId','BeaconId'])
    .toSql();
var t2 = from('UserBeacon ub')
    .join('Beacon b','b.BeaconId = ub.BeaconId')
    .join('User u','u.UserId = ub.UserId')
    .where('b.Uid = $beaconUid')
    .select('ub.UserId, ub.BeaconId, b.Uid, u.First, u.Last')
    .toSql();
    
console.log(q1);
console.log(t1);
console.log(t2);
*/
module.exports = {
    from: from,
    From: from
};