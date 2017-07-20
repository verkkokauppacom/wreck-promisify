'use strict'

const Wreck = require('wreck')
const Promise = require('bluebird');
const symbol = Symbol.for('wreck');

// Set default configuration for Wreck and get new instance
const outbound = {}
outbound.wreck = Wreck.defaults({
    timeout: 2000
})

const inbound = module.exports = {};

inbound.request = (method, uri, options) => {
    return new Promise((resolve, reject) => {

        outbound.wreck.request(method, uri, options, (err, res) => {
            if (err) {
                return reject(err)
            }
            outbound.wreck.read(res, {}, function (err, body) {
                if (err) {
                    return reject(err)
                }
                if (body instanceof Buffer) {
                    body = body.toString("utf8");
                    return resolve(body);
                }

            })
        })
    })
}

inbound.defaults = (options) => {
    outbound.wreck = outbound.wreck.defaults(options)
}

inbound.get = (uri, options) => {
    return inbound.request('GET', uri, options)
}
inbound.post = (uri, options) => {
    return inbound.request('POST', uri, options)
}
inbound.put = (uri, options) => {
    return inbound.request('PUT', uri, options)
}
inbound.delete = (uri, options) => {
    return inbound.request('DELETE', uri, options)
}

inbound.trace = (isEnable) => {
    const obj = {
        "label": "wreck-promisify",
        res: {},
        req: {},
        timestamp: {}
    };
    if (isEnable) {
        process[symbol].on('response', (err, details) => {
            if (!err) {
                obj.res.url = details.uri.href;
                obj.res.method = details.uri.method;
                obj.res.headers = details.uri.headers;
                obj.res.headers["content-type"] = details.res.headers["content-type"];
                obj.timestamp.start = details.start;
                obj.timestamp.end = Date.now();
                obj.timestamp.total = ((obj.timestamp.end - obj.timestamp.start) / 1000) + "seconds";
                console.info("Response", obj);
            }
        });

        process[symbol].on('request', (uri, options) => {
            obj.req.url = uri.href;
            obj.req.method = uri.method;
            obj.req.query = uri.query;
            obj.req.options = options;
        });
    }
}
