// Multimedia Engeneering II - Übung 4
// Nils Kienöl (797863)

var frisby = require('frisby');
var ip = "http://localhost";
var port = 8002;
var apiPATH = "/api/v1";
var ip_port = ip + ":" + port;

//console.log("GET ALL STREAMS");

frisby.create('get all streams')
    .get(ip_port + apiPATH + "/streams")
    .expectStatus(200)
    //.inspectJSON()
    .expectHeaderContains("content-type", "application/json")
    .toss();

//console.log("POST A STREAM");

frisby.create("post a stream")
    .post(ip_port + apiPATH + "/streams",
    {
        id: 99,
        name: "New Stream"

    })
    .expectStatus(200)
    //.inspectJSON()
    .expectHeaderContains("content-type", "application/json")
    .toss();
//
////console.log("GET A STREAM BY ID");
//
frisby.create('get stream by id -> -> GET /streams/1')
    .get(ip_port + apiPATH + "/streams/1")
    .expectStatus(200)
    //.inspectJSON()
    .expectHeaderContains("content-type", "application/json")
    .toss();
//
////console.log("UPDATE A STREAM BY ID");
//
frisby.create("update a stream by id and json input -> -> PUT /streams/1")
    .put(ip_port + apiPATH + "/streams/1",
    {
        id: 1,
        name: "Stream 1337"

    })
    .expectStatus(200)
    //.inspectJSON()
    .expectHeaderContains("content-type", "application/json")
    .toss();
//
////console.log("DELTE A STREAM BY ID");
//
frisby.create("delete a stream by id -> DELETE /streams/1")
    .delete(ip_port + apiPATH + "/streams/1")
    .expectStatus(200)
    //.inspectJSON()
    .expectHeaderContains("content-type", "application/json")
    .toss();
//
//
frisby.create("BIG STREAM TEST -> POST, GET, PUT, DELETE")
    .post(ip_port + apiPATH + "/streams", {id: "99", name: "TEST STREAM"})
    .expectStatus(200)
    .expectHeaderContains("content-type", "application/json")

    .afterJSON(function (json) {
        frisby.create("GET TEST STREAM")
            .get(ip_port + apiPATH + "/streams/" + json.id)
            .expectStatus(200)
            .expectHeaderContains("content-type", "application/json")
            .afterJSON(function (json) {
                frisby.create("UPDATE TEST STREAM")
                    .put(ip_port + apiPATH + "/streams/" + json.id, {name: "UPDATED TEST STREAM"})
                    .expectStatus(200)
                    .expectHeaderContains("content-type", "application/json")
                    .afterJSON(function (json) {
                        frisby.create("DELTE TEST STREAM")
                            .delete(ip_port + apiPATH + "/streams/" + json.id)
                            .expectStatus(200)
                            .expectHeaderContains("content-type", "application/json")
                            .toss();
                    })
                    .toss();
            })
            .toss();
    })
    .toss();



