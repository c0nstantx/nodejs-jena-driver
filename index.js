/**
 * Description of index.js
 *
 * @author K.Christofilos <kostas.christofilos@gmail.com>
 */

'use strict';

/* Express framework */
var express = require('express');
var app = express();

/**
 * Send tasks to queue for processing
 *
 * /v1/task_manager/init/tasks
 *
 */
app.get('/', function (req, res) {
    var Server = require('./lib');
    var fuseki = new Server();

    var query = 'PREFIX d: <http://learningsparql.com/ns/data#>SELECT ?type ?value WHERE { d:x ?type ?value } LIMIT 25';
    var dataset = 'dbpedia';
    fuseki.connect(function(err, con) {
        if (err) {
            res.status(err.code || 500).jsonp(err);
        } else {
            var insert = 'PREFIX d: <http://learningsparql.com/ns/data#>PREFIX dm: <http://learningsparql.com/ns/demo#>INSERT DATA{d:x dm:tag "3" .}';
            con.update(dataset, insert, function(err, data) {
                console.log(err);
                console.log(data);
            });
            con.select(dataset, query, function(err, data) {
                console.log(err);
                console.log(data);
                if (err) {
                    res.status(err.code || 500).jsonp(err);
                } else {
                    res.jsonp(data);
                }
            });
        }
    });
});

var server = app.listen(3000, function () {
    var host = 'localhost',
        port = '3000';

    console.log('Server listening at http://%s:%s', host, port);
});
