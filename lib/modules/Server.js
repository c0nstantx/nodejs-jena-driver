/**
 * Description of Server
 *
 * @author K.Christofilos <kostas.christofilos@gmail.com>
 */

'use strict';

var connection = require('./Connection');

var Server = function(host, port) {
    this.host = host || 'localhost';
    this.port = port || 3030;
    this.headers = {};
    this.error = null;
    this.connection = null;

    this.connect = function(callback) {
        this.validateConnection();
        if (this.error) {
            return callback && callback(this.error, null);
        }

        this.connection = new connection(this.host, this.port);

        return callback && callback(null, this.connection);
    };

    this.validateConnection = function() {
        if (!this.host) {
            this.error = new Error('No host was defined');
        } else if (!this.port) {
            this.error = new Error('No port was defined');
        }
    };
};

module.exports = Server;