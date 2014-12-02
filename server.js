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

for (var interface in interfaces) {
    var alias = 0;
    interfaces[interface].forEach(function (details) {
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

// ERROR JSON
var error_404 = __dirname + '/resources/data/status/error_404.json';

// ROUTES

// route redirect
routerRedirect.get('/', function (req, res) {
    res.redirect('/api');
});

// middleware to use for all requests
router.use(function (req, res, next) {
    // do logging
    console.log(req.method, ' at ', time(), ' from ', req.ip, ' to ', req.originalUrl);
    next(); // make sure we go to the next routes and don't stop here
});


// route for default information
router.get('/', function (req, res) {
    res.sendFile(packageJSON);
    console.log('sendFile -> ', packageJSON);
});

// route -> /streams
router.route('/streams')

    // post
    .post(function (req, res) {
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
    })
    // get
    .get(function (req, res) {
        res.json(streamsData);
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
            console.log("No Stream found.");
            res.sendFile(error_404);
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
                res.json(streamData);
            }
        });
        if (error) {
            console.log("No Stream found.");
            res.sendFile(error_404);
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
            console.log("No Stream found.");
            res.sendFile(error_404);
        }

    })
;
// REGISTER ROUTES
// register redirect for '/'
app.use('/', routerRedirect);
app.use('/api', router);


// DOCUMENTATION
// -    -   -   -   -   -   -   -   -   -

//var swagger = require("swagger-node-express");
//// Couple the application to the Swagger module.
//swagger.setAppHandler(app);

// START SERVER
// -    -   -   -   -   -   -   -   -   -

var server = app.listen(port, function () {
    console.log("NodeJS Express Server started.");
    console.log("External IP:PORT :", external_ip + ":" + server.address().port);
    console.log("Internal IP:PORT :", internal_ip + ":" + server.address().port);
    console.log("Size of streamsData", streamsData.length);
});