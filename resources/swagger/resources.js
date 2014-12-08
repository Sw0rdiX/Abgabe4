var swagger = require("swagger-node-express");
var paramTypes = swagger.paramTypes;
var url = require("url");
var swe = swagger.errors;

exports.createStream = {
    'spec': {
        "description": "Operations about streams",
        "path": "/api/streams",
        "notes": "Returns a created Stream",
        "summary": "Create a new Stream",
        "method": "POST",
        "parameters": [paramTypes.body("body", "Stream object that will be created (Id is not relevant)", "Stream")],
        "type": "Stream",
        "errorResponses": [swagger.errors.invalid('id'),swagger.errors.invalid('name')],
        "nickname": "createStreams"
    }
};

exports.readAllStreams = {
    'spec': {
        "description": "Operations about streams",
        "path": "/api/streams",
        "notes": "Returns all streams in the database",
        "summary": "Find all streams",
        "method": "GET",
        "type": "Stream",
        "errorResponses": [swagger.errors.notFound('stream')],
        "nickname": "readAllStreams"
    }
};

exports.readStreamById = {
    'spec': {
        "description": "Operations about streams",
        "path": "/api/streams/{streamId}",
        "notes": "Returns a stream based on ID",
        "summary": "Find stream by ID",
        "method": "GET",
        "parameters": [swagger.pathParam("streamId", "ID of stream that needs to be fetched", "integer")],
        "type": "Stream",
        "errorResponses": [swagger.errors.invalid('id'), swagger.errors.notFound('stream')],
        "nickname": "readStreamById"
    }
};

exports.updateStreamById = {
    'spec': {
        "description": "Operations about streams",
        "path": "/api/streams/{streamId}",
        "notes": "Returns a stream based on ID",
        "summary": "Update stream by ID",
        "method": "PUT",
        "parameters": [swagger.pathParam("streamId", "ID of stream that needs to be updated", "integer"),paramTypes.body("body", "Stream object that needs to be updated in the store", "Stream")],
        "type": "Stream",
        "errorResponses": [swagger.errors.invalid('id'), swagger.errors.invalid('name')],
        "nickname": "updateStreamById"
    }
};

exports.deleteStreamById = {
    'spec': {
        "description": "Operations about streams",
        "path": "/api/streams/{streamId}",
        "notes": "Returns a stream based on ID",
        "summary": "Delete stream by ID",
        "method": "DELETE",
        "parameters": [swagger.pathParam("streamId", "ID of stream that needs to be delete", "integer")],
        "type": "Stream",
        "errorResponses": [swagger.errors.invalid('id'), swagger.errors.notFound('stream')],
        "nickname": "deleteStreamById"
    }
};