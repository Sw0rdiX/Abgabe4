exports.models = {
    "Stream": {
        "id": "Stream",
        "required": ["id", "name"],
        "properties": {
            "id": {
                "type": "integer",
                "format": "int64",
                "description": "Unique identifier for the Stream",
                "minimum": "0.0",
                "maximum": "1000.0"
            },
            "name": {
                "type": "string",
                "description": "Friendly name of the Stream"
            }
        }
    }
};
