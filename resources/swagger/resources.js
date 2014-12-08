var swagger = require("swagger-node-express");
var paramTypes = swagger.paramTypes;
var url = require("url");
var swe = swagger.errors;

// the description will be picked up in the resource listing
exports.createStream = {
    'spec': {
        "description": "Operations about streams",
        "path": "/api/streams",
        "notes": "Returns a created Stream",
        "summary": "Create a new Stream",
        "method": "POST",
        "type": "Stream",
        "errorResponses": [swagger.errors.notFound('streams')],
        "nickname": "createStreams"
    }
};

// the description will be picked up in the resource listing
exports.readAllStreams = {
    'spec': {
        "description": "Operations about streams",
        "path": "/api/streams",
        "notes": "Returns all streams in the database",
        "summary": "Find all streams",
        "method": "GET",
        "type": "Stream",
        "errorResponses": [swagger.errors.notFound('streams')],
        "nickname": "readAllStreams"
    }
};



// the description will be picked up in the resource listing
exports.readStreamById = {
    'spec': {
        "description": "Operations about streams",
        "path": "/api/streams/{streamId}",
        "notes": "Returns a stream based on ID",
        "summary": "Find stream by ID",
        "method": "GET",
        "parameters": [swagger.pathParam("streamId", "ID of stream that needs to be fetched", "string")],
        "type": "Stream",
        "errorResponses": [swagger.errors.invalid('id'), swagger.errors.notFound('streams')],
        "nickname": "readStreamById"
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

// the description will be picked up in the resource listing
exports.updateStreamById = {
    'spec': {
        "description": "Operations about streams",
        "path": "/api/streams/{streamId}",
        "notes": "Returns a stream based on ID",
        "summary": "Update stream by ID",
        "method": "PUT",
        "parameters": [swagger.pathParam("streamId", "ID of stream that needs to be updated", "string"),paramTypes.body("body", "Pet object that needs to be updated in the store", "Pet")],
        "type": "Stream",
        "errorResponses": [swagger.errors.invalid('id'), swagger.errors.notFound('streams')],
        "nickname": "updateStreamById"
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

// the description will be picked up in the resource listing
exports.deleteStreamById = {
    'spec': {
        "description": "Operations about streams",
        "path": "/api/streams/{streamId}",
        "notes": "Returns a stream based on ID",
        "summary": "Delete stream by ID",
        "method": "DELETE",
        "parameters": [swagger.pathParam("streamId", "ID of stream that needs to be delete", "string")],
        "type": "Stream",
        "errorResponses": [swagger.errors.invalid('id'), swagger.errors.notFound('streams')],
        "nickname": "deleteStreamById"
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