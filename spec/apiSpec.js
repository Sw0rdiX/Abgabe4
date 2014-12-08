var frisby = require('frisby');
var ip = "http://localhost";
var port = 8002;
var ip_port = ip + ":" + port;

//console.log("GET ALL STREAMS");

frisby.create('get streams')
    .get(ip_port + "/api/streams")
    .expectStatus(200)
    //.inspectJSON()
    .expectHeaderContains("content-type", "application/json")
    .toss();

//console.log("POST A STREAM");

frisby.create("post a stream and get this stream back")
    .post(ip_port + "/api/streams",
    {
        id: 99,
        name: "New Stream"

    })
    .expectStatus(200)
    //.inspectJSON()
    .expectHeaderContains("content-type", "application/json")
    .toss();

//console.log("GET A STREAM BY ID");

frisby.create('get stream by id -> -> GET /streams/1')
    .get(ip_port + "/api/streams/1")
    .expectStatus(200)
    //.inspectJSON()
    .expectHeaderContains("content-type", "application/json")
    .toss();

//console.log("UPDATE A STREAM BY ID");

frisby.create("update a stream by id and json input -> -> PUT /streams/1")
    .put(ip_port + "/api/streams/1",
    {
        id: 1,
        name: "Stream 1337"

    })
    .expectStatus(200)
    //.inspectJSON()
    .expectHeaderContains("content-type", "application/json")
    .toss();

//console.log("DELTE A STREAM BY ID");

frisby.create("delete a stream by id -> DELETE /streams/1")
    .delete(ip_port + "/api/streams/1")
    .expectStatus(200)
    //.inspectJSON()
    .expectHeaderContains("content-type", "application/json")
    .toss();