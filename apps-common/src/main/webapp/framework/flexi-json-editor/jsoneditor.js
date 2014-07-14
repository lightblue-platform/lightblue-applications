var json = {
    "entityInfo": {
        "name": "terms",
        "indexes": [
            {
                "unique": true,
                "fields": [{"_id": "$asc"}]
            }
        ],
        "enums": [
            {
                "name": "status",
                "values": ["active", "inactive"]
            },
            {
                "name": "operator",
                "values": [
                    "equals",
                    "not_equals",
                    "start_with",
                    "end_with",
                    "contains",
                    "not_contains"
                ]
            }
        ],
        "datastore": {
            "mongo": {
                "collection": "terms"
            }
        }
    },
    "schema": {
        "name": "terms",
        "version": {
            "value": "1.1.0",
            "changelog": "Initial version"
        },
        "status": {
            "value": "active"
        },
        "access": {
            "insert": ["admin"],
            "find": ["admin", "ANY"],
            "update": ["admin"],
            "delete": ["admin"]
        },
        "fields": {
            "createdBy": {
                "type": "string",
                "description": "Identifies who created this entity.  Ideally, a login.  Worst case an ID from some other system.",
                "constraints": {
                    "required": true
                }
            },
            "creationDate": {
                "type": "date",
                "description": "Date the entity was created.",
                "constraints": {
                    "required": true
                }
            },
            "lastUpdatedBy": {
                "type": "string",
                "description": "Identifies who last updated this entity.  Ideally, a login.  Worst case an ID from some other system.",
                "constraints": {
                    "required": true
                }
            },
            "lastUpdateDate": {
                "type": "date",
                "description": "Date the entity was last updated.",
                "constraints": {
                    "required": true
                }
            },
            "_id": {
                "type": "integer",
                "description": "The identifier of the term.",
                "constraints": {
                    "required": true
                }
            },
            "termsType": {
                "type": "string",
                "description": "REFERENCE: termsType.code",
                "constraints": {
                    "required": true
                }
            },
            "termsCategory": {
                "type": "string",
                "description": "REFERENCE: termsCategory.code"
            },
            "productAttribute": {
                "type": "array",
                "description": "Ties the terms to any product with the specified attributes.  All attribute conditions must be met.",
                "fields": {
                    "code": {
                        "type": "string",
                        "description": "The name of a product attribute code on 'product' entity. REFERENCE: TBD"
                    },
                    "op": {
                        "type": "string",
                        "constraints": {
                            "enum": "operator"
                        }
                    },
                    "value": {
                        "type": "string",
                        "description": "The value of the attribute."
                    }
                }
            },
            "siteCode": {
                "type": "string"
            },
            "hostname": {
                "type": "string"
            },
            "optional": {
                "type": "boolean",
                "description": "If true, term doesn't have to be accepted when user logs in."
            },
            "status": {
                "type": "string",
                "constraints": {
                    "enum": "status",
                    "required": true
                }
            },
            "startDate": {
                "type": "date"
            },
            "endDate": {
                "type": "date"
            },
            "termsVerbiage": {
                "type": "array",
                "fields": {
                    "name": {
                        "type": "string"
                    },
                    "description": {
                        "type": "string"
                    },
                    "version": {
                        "type": "string"
                    },
                    "status": {
                        "type": "string",
                        "constraints": {
                            "enum": "status",
                            "required": true
                        }
                    },
                    "startDate": {
                        "type": "date"
                    },
                    "endDate": {
                        "type": "date"
                    },
                    "termsVerbiageTranslation": {
                        "type": "array",
                        "fields": {
                            "localeCode": {
                                "type": "string",
                                "description": "REFERENCE: locale.code",
                                "constraints": {
                                    "required": true
                                }
                            },
                            "URL": {
                                "type": "string"
                            },
                            "body": {
                                "type": "string",
                                "description": "Translated body for the term verbage."
                            },
                            "version": {
                                "type": "string"
                            },
                            "published": {
                                "type": "boolean"
                            },
                            "language": {
                                "type": "string",
                                "description": "Language denormalized from locale."
                            },
                            "status": {
                                "type": "string",
                                "constraints": {
                                    "enum": "status",
                                    "required": true
                                }
                            },
                            "startDate": {
                                "type": "date"
                            },
                            "endDate": {
                                "type": "date"
                            }
                        }
                    }
                }
            }
        }
    }
}

function printJSON() {
    $('#json').val(JSON.stringify(json));

}

function updateJSON(data) {
    json = data;
    printJSON();
}

function showPath(path) {
    $('#path').text(path);
}

$(document).ready(function() {

    $('#rest > button').click(function() {
        var url = $('#rest-url').val();
        $.ajax({
            url: url,
            dataType: 'jsonp',
            jsonp: $('#rest-callback').val(),
            success: function(data) {
                json = data;
                $('#editor').jsonEditor(json, { change: updateJSON, propertyclick: showPath });
                printJSON();
            },
            error: function() {
                alert('Something went wrong, double-check the URL and callback parameter.');
            }
        });
    });

    $('#json').change(function() {
        var val = $('#json').val();

        if (val) {
            try { json = JSON.parse(val); }
            catch (e) { alert('Error in parsing json. ' + e); }
        } else {
            json = {};
        }
        
        $('#editor').jsonEditor(json, { change: updateJSON, propertyclick: showPath });
    });

    $('#expander').click(function() {
        var editor = $('#editor');
        editor.toggleClass('expanded');
        $(this).text(editor.hasClass('expanded') ? 'Collapse' : 'Expand all');
    });
    
    printJSON();
    $('#editor').jsonEditor(json, { change: updateJSON, propertyclick: showPath });
});


