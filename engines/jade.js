// @themost-framework 2.0 Codename Blueshift Copyright (c) 2017-2025, THEMOST LP All rights reserved
var fs = require('fs');
var pug = require('pug');
var LangUtils = require('@themost/common').LangUtils;
var ArgumentError = require('@themost/common').ArgumentError;
var HttpViewEngine = require('../types').HttpViewEngine;
/**
 * @class
 * @param {HttpContext=} context
 * @constructor
 * @augments {HttpViewEngine}
 */
function JadeEngine(context) {
    JadeEngine.super_.bind(this)(context);
}
LangUtils.inherits(JadeEngine,HttpViewEngine);
/**
 * @param {string} file
 * @param {*} data
 * @param {Function} callback
 */
JadeEngine.prototype.render = function(file, data, callback) {
    callback = callback || function () {};
    try {
        var self = this;
        if (typeof file !== 'string') {
            return callback(new ArgumentError("Jade template URI must be a string."));
        }
        fs.readFile(file, 'utf8', function(err, source) {
            if (err) {
                return callback(err);
            }
            //render data
            try {
                var fn = pug.compile(source, {
                    filename: file,
                    pretty: true
                });
                var html = { };
                Object.defineProperty(html, 'context', {
                    get: function() {
                        return self.context;
                    },
                    enumerable:false, configurable:false
                });
                var result = fn({
                    html:html,
                    model:data
                });
                return callback(null, result);
            }
            catch (err) {
                    return callback(err);
                }
    });
    } catch (err) {
        return callback(err);
    }
};
/**
 * @static
 * @param  {HttpContext=} context
 * @returns {JadeEngine}
 */
JadeEngine.createInstance = function(context) {
    return new JadeEngine(context);
};

if (typeof exports !== 'undefined') {
    module.exports.JadeEngine = JadeEngine;
    /**
     * @param {HttpContext=} context
     * @returns {JadeEngine}
     */
    module.exports.createInstance = function(context) {
        return JadeEngine.createInstance(context);
    };
}
