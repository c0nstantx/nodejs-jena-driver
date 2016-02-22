/**
 * Description of Gruntfile.js
 *
 * @author K.Christofilos <kostas.christofilos@gmail.com>
 */

'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
        server: {
            options: {
                port: 9000,
                keepalive: true
            }
        },
        browserify: {
            js: {
                src: 'lib/index.js',
                dest: 'lib.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-serve');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', [
        'browserify'
    ])
};