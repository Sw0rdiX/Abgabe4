// Load module dependencies.
var express = require("express")
    , url = require("url")
    , swagger = require("swagger-node-express")
    , bodyParser = require('body-parser')
    ;

// Create the application.
var app = express();
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// style json output in browser for better reading
app.set('json spaces', 4);


// Couple the application to the Swagger module.
swagger.setAppHandler(app);
var Models = require("./models.js");
swagger.addModels(Models);

var findById = {
    'spec': {
        "description": "Operations about pets",
        "path": "/pet.{format}/{petId}",
        "notes": "Returns a pet based on ID",
        "summary": "Find pet by ID",
        "method": "GET",
        "parameters": [swagger.pathParam("petId", "ID of pet that needs to be fetched", "string")],
        "type": "Pet",
        "errorResponses": [swagger.errors.invalid('id'), swagger.errors.notFound('pet')],
        "nickname": "getPetById"
    },
    'action': function (req, res) {
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

swagger.configure("http://petstore.swagger.wordnik.com", "0.1");

app.listen(8002);