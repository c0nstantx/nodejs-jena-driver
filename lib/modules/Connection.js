/**
 * Description of Connection
 *
 * @author K.Christofilos <kostas.christofilos@gmail.com>
 */

'use strict';

var request = require('request'),
    querystring = require('querystring'),
    http = require('http'),
    https = require('https');

var Connection = function(host, port) {
    this.secure = false;
    this.host = host;
    this.port = port;
    this.method = 'POST';
    this.agent = null;

    var protocolPattern = /^(https?):\/\//;

    if (protocolPattern.test(this.host)) {
        var protocol = this.host.match(protocolPattern)[1];
        this.host = this.host.replace(protocolPattern, '');
        this.secure = protocol === 'https';
    }

    if (this.secure) {
        this.agent = new (https.Agent)();
    } else {
        this.agent = (http.Agent)();
    }

    this.update = function(dataset, query, callback) {
        var postData = querystring.stringify({
            'update': query
        });
        var requestOptions = this._buildOptions(this._url(dataset), postData);

        this._request(requestOptions, function(err, data) {
            return callback && callback(err, data);
        });
    };

    /**
     *
     * @param dataset
     * @param query
     * @param callback
     */
    this.select = function(dataset, query, callback) {
        var postData = querystring.stringify({
            'query': query
        });
        var requestOptions = this._buildOptions(this._url(dataset), postData);

        this._request(requestOptions, function(err, data) {
            return callback && callback(err, data);
        });
    };

    /**
     *
     * @param dataset
     * @returns {string}
     * @private
     */
    this._url = function(dataset) {
        var protocol = this.secure ? 'https' : 'http';
        return protocol+'://'+this.host+':'+this.port+'/'+dataset;
    };

    /**
     *
     * @param uri
     * @param data
     * @returns {{data: *, agent: *, uri: *, method: *, headers: {Accept: string, Content-Type: string, Content-Length: *}}}
     * @private
     */
    this._buildOptions = function(uri, data) {
        return {
            data: data,
            agent: this.agent,
            uri: uri,
            method: this.method,
            headers: {
                'Accept': 'application/sparql-results+json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': data.length
            }
        };
    };

    /**
     *
     * @param options
     * @param callback
     * @private
     */
    this._request = function(options, callback) {
        var req = request(options, function(err, res) {
            if (err) {
                return callback && callback(err, null);
            }

            try {
                var data = JSON.parse(res.body);
                return callback && callback(null, data);
            } catch(e) {
                return callback && callback(e, null);
            }
        });

        req.write(options.data);
        req.end();
    }
};

module.exports = Connection;