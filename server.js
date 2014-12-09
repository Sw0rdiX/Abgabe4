// server.js

// HELPERS
var time = function () {
    return Date.now();
};

// NETWORK INFORMATION
// -    -   -   -   -   -   -   -   -   -
// determine with os nodejs module the internal and external ip (IPv4)

// setup
var os = require('os');

var interfaces = os.networkInterfaces();
var external_ip;
var internal_ip;

for (var elem in interfaces) {
    interfaces[elem].forEach(function (details) {
        if (details.family == 'IPv4') {
            if (details.internal == false) {
                external_ip = details.address;
            }
            if (details.internal == true) {
                internal_ip = details.address;
            }
        }
    });
}

// WRITE JSON TO FILE METHOD
var jsonToFile = function (inputJson, outputFilename) {
    fs.writeFile(outputFilename, JSON.stringify(inputJson, null, 4), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("WRITE  JSON saved to " + outputFilename);
        }
    });
};

// REST API
// -    -   -   -   -   -   -   -   -   -
// description

// setup
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
var routerRedirect = express.Router();
//Synchronous version
var streamsData = JSON.parse(fs.readFileSync('./resources/data/streams/streamData.json', 'utf8'));

// APP PRE-CONFIG

// set server port
var port = process.env.PORT || 8080;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// style json output in browser for better reading
app.set('json spaces', 4);

// PACKAGE JSON
var packageJSON = __dirname + '/package.json';
packageJSON = JSON.parse(fs.readFileSync(packageJSON, 'utf8'));

// ERROR JSON
var error_404 = __dirname + '/resources/data/status/error_404.json';
error_404 = JSON.parse(fs.readFileSync(error_404, 'utf8'));


// ROUTES

//// route redirect
//routerRedirect.get('/', function (req, res) {
//    console.log(req.method, ' at ', time(), ' from ', req.ip, ' to ', req.originalUrl);
//    console.log('REDIRECT', ' at ', time(), ' from ', req.ip, ' to ', '-> api');
//    res.redirect('/api');
//});

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log(req.method, ' at ', time(), ' from ', req.ip, ' to ', req.originalUrl);
    next(); // make sure we go to the next routes and don't stop here
});


// route for default information
router.get('/', function (req, res) {
    //res.sendFile(packageJSON);
    res.json(packageJSON);
    console.log('sendFile -> ', "packageJSON");
});

// route -> /streams
router.route('/streams')

    // post
    .post(function (req, res) {
        if (!req.body.hasOwnProperty('name')) {
            console.error("ERROR  Wrong Stream POST!");
            res.status(404).json(error_404);
        }
        else {
            var oldStreamsDataLength = streamsData.length;
            var newID = 0;
            streamsData.forEach(function (streamData) {
                if (streamData.id > newID) {
                    newID = streamData.id;
                }
            });
            var newEntry = {
                "id": newID + 1,
                "name": req.body.name
            };
            streamsData.push(newEntry);
            console.log("NEW ENTRY with ID", newEntry.id);
            console.log("NEW SIZE of streamsData", streamsData.length, "before", oldStreamsDataLength);
            res.json(newEntry);
        }
    })
    // get
    .get(function (req, res) {
        var error = true;
        if (streamsData.length == 0) {
            console.error("ERROR  No Stream found.");
            res.status(404).sendFile(error_404);
            error = false;
        }
        if (error) {
            console.log('RESPONSE', ' at ', time(), ' from ', 'server', ' to ', req.ip);
            res.json(streamsData);
        }

    })
;

// route -> /streams/:id
router.route('/streams/:stream_id')

    // get -> stream by id
    .get(function (req, res) {
        var searchID = req.param('stream_id');
        var error = true;
        streamsData.forEach(function (streamData) {
            if (streamData.id == searchID) {
                console.log("Stream found.");
                error = false;
                res.json(streamData);
            }
        });
        if (error) {
            console.error("ERROR  No Stream found.");
            res.status(404).json(error_404);
        }
    })

    // put -> stream by id
    .put(function (req, res) {

        var searchID = req.param('stream_id');
        var error = true;
        streamsData.forEach(function (streamData) {
            if (streamData.id == searchID) {
                console.log("CHANGE  Name from (", streamData.name, ") to (", req.body.name, ")");
                error = false;
                streamData.name = req.body.name;
                console.log('RESPONSE', ' at ', time(), ' from ', 'server', ' to ', req.ip);
                res.json(streamData);
            }
        });
        if (error) {
            console.error("ERROR  No Stream found for this id " + searchID + ".");
            res.status(404).json(error_404);
        }

    })

    // delete -> stream by id
    .delete(function (req, res) {

        var searchID = req.param('stream_id');
        var error = true;
        var oldStreamsDataLength = streamsData.length;
        streamsData.forEach(function (streamData) {
            if (streamData.id == searchID) {
                console.log("DELTE  Stream with ID", searchID);
                error = false;
                streamsData = streamsData.filter(function (item) {
                    return (item.id != streamData.id)
                });
                //console.log(streamsData);
                res.json(streamData);
                console.log("NEW SIZE  of streamsData", streamsData.length, "before", oldStreamsDataLength);
            }
        });
        if (error) {
            console.error("ERROR  No Stream found.");
            res.status(404).json(error_404);
        }

    })
;
// REGISTER ROUTES
// register redirect for '/'
//app.use('/', routerRedirect);
app.use('/api', router);

// DOCUMENTATION
// -    -   -   -   -   -   -   -   -   -

// SETTING CORS
var cors = require("cors");
var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (origin === undefined) {
            callback(null, false);
        } else {
            // change wordnik.com to your allowed domain.
            var match = origin.match("^(.*)?.(\:[0-9]+)?");
            var allowed = (match !== null && match.length > 0);
            callback(null, allowed);
        }
    }
};
app.use(cors(corsOptions));

//app.use('/api-docs', express.static(__dirname + '/node_modules/swagger-node-express/swagger-ui'));
// make a static handler
var docs_handler = express.static(__dirname + '/node_modules/swagger-node-express/swagger-ui');
// use core for rewritten request url for allow-cross-domain
app.get(/^\/docs(\/.*)?$/, function (req, res, next) {
    if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
        res.writeHead(302, {'Location': req.url + '/'});
        res.end();
        return;
    }
    // take off leading /docs so that connect locates file correctly
    req.url = req.url.substr('/docs'.length);
    return docs_handler(req, res, next);
});

var swagger = require("swagger-node-express");

// Couple the application to the Swagger module.
swagger.setAppHandler(app);

var models = require("./resources/swagger/models.js");
var streamResources = require("./resources/swagger/resources.js");

// CRUD = Create Read Update Delete
swagger.addModels(models);
swagger.addPost(streamResources.createStream);
swagger.addGet(streamResources.readAllStreams);
swagger.addGet(streamResources.readStreamById);
swagger.addPut(streamResources.updateStreamById);
swagger.addDelete(streamResources.deleteStreamById);


swagger.configureSwaggerPaths("", "api-docs", "");
swagger.setHeaders = function setHeaders(res) {
    res.header("Access-Control-Allow-Headers", "Content-Type, X-API-KEY");
    res.header("Content-Type", "application/json; charset=utf-8");
};
swagger.configure('', require('./package.json').version);
port = 8002;
//swagger.configure("http://" + external_ip +":"+ port, "0.1");
swagger.configure("http://localhost:"+ port+"", "0.1");
// START SERVER
// -    -   -   -   -   -   -   -   -   -
//port = 8002;
var server = app.listen(port, function () {
    var extern = external_ip + ":" + server.address().port;
    var intern = internal_ip + ":" + server.address().port + ":" + server.address().port;
    console.log("NodeJS Express Server (with Swagger UI & Jasmine started.");
    console.log("External IP:PORT :", extern);
    console.log("Internal IP:PORT :", intern);
    console.log("Documentation Extern(No Requests) :", extern + "/docs");
    console.log("Documentation Intern:", intern + "/docs");
    console.log("Size of streamsData", streamsData.length);
});