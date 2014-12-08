// Load module dependencies.
var express = require("express")
    , url = require("url")
    , swagger = require("swagger-node-express");
var bodyParser = require('body-parser');


// Create the application.
var app = express();
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Couple the application to the Swagger module.
swagger.setAppHandler(app);

var models = require("./resources/swagger/models.js");

swagger.addModels(models);

var findById = {
    'spec': {
        "description" : "Operations about pets",
        "path" : "/pet.{format}/{petId}",
        "notes" : "Returns a pet based on ID",
        "summary" : "Find pet by ID",
        "method": "GET",
        "parameters" : [swagger.pathParam("petId", "ID of pet that needs to be fetched", "string")],
        "type" : "Pet",
        "errorResponses" : [swagger.errors.invalid('id'), swagger.errors.notFound('pet')],
        "nickname" : "getPetById"
    },
    'action': function (req,res) {
        if (!req.params.petId) {
            throw swagger.errors.invalid('id');
        }
        var id = parseInt(req.params.petId);
        var pet = petData.getPetById(id);

        if (pet) {
            res.send(JSON.stringify(pet));
        } else {
            throw swagger.errors.notFound('pet');
        }
    }
};

swagger.addGet(findById);

swagger.configure("http://localhost:8002/swagger", "0.1");

app.listen(8002);
