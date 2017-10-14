function showErrorMessage(message) {
    "use strict";

      $('#alert-box').append(createBoostrapAlertDiv('alert-danger', "<strong>Error!</strong> "+message));
}

function showLightblueErrorMessage(jsonMessage) {
    "use strict";
      console.error(JSON.stringify(jsonMessage));
      showErrorMessage(jsonMessage.errorCode);
}

function showSuccessMessage(message) {
    "use strict";

      var div = createBoostrapAlertDiv('alert-success', "<strong>Success!</strong> "+message);

      $('#alert-box').append(div);

      // remove success message after 3s
      setTimeout(function() {
         div.slideUp('slow', function() { $(this).remove(); });
      }, 3000);
  }

  function createBoostrapAlertDiv(clazz, htmlMessage) {
      "use strict";

      return $(document.createElement('div'))
          .addClass('alert')
          .addClass(clazz)
          .html("<a href='#' class='close' data-dismiss='alert'>&times;</a>"+htmlMessage);
}

function isAdmin() {
    "use strict";
    return $.inArray('lb-metadata-admin', window.roles) > -1;
}

// validation successful on null
function validateActionSubmit(event, fieldsToValidate) {
    "use strict";
    var errors = new Array();
    $.each(event, function(key, value) {
        if (value == null && $.inArray(key, fieldsToValidate) > -1) {
            errors.push(key);
        }
    });

    return errors;
}

function onActionSubmit(event) {
    "use strict";

    showView(event);

    switch (event.action) {
        case 'view':
            $("#removeItemHowToMessage").hide();
            break;
        default:
            $("#removeItemHowToMessage").show();
    }

    if (event.isEditable) {
        // initialize save & reset buttons
        $("#editButtons").css('display', 'inline-block');
    }
    else {
        $("#editButtons").hide();
    }

}

function onJsonEditorReady(event) {
    "use strict";
    switch (event.action) {
        case 'version':
            var entityInfoDiv = $("#editor input[title='entityInfo']").parent();
            entityInfoDiv.find("input").attr('disabled', true);
            entityInfoDiv.find("button").hide();
            break;
        default:
            ;
    }
}

function showView(event) {
    "use strict";
    $("div.view-div").hide();
    if (typeof event !== "undefined") {
        if (event.isJsonEditorView)
            $("#view-jsonEditor").show();
        else
            $("#view-"+event.action).show();
    }
}

function onViewRoles(event) {
    "use strict";
    $.getJSON( metadataServicePath + event.entity + "/" + event.version + "/roles", function( json ) {
        var roles = json.processed;

        $("#view-roles").empty();
        $.each(roles, function(i, role) {
            $("#view-roles").append(createAccordionWidgetDiv('role', role.role, role));
        });
    });
}

function onViewSummary(event) {
    "use strict";
    $("#view-summary").empty();
    $.getJSON( metadataServicePath, function( entities ) {
        $.each(entities.entities, function(i, entity) {
            $.getJSON( metadataServicePath + entity, function( versions ) {

                var entityVersions = new Object();
                entityVersions.active = new Array();
                entityVersions.deprecated = new Array();
                entityVersions.disabled = new Array();
                entityVersions.default = new Array();

                $.each(versions, function(j, version) {
                    switch (version.status) {
                        case 'active':
                            entityVersions.active.push(version.version);
                            break;
                        case 'deprecated':
                            entityVersions.deprecated.push(version.version);
                            break;
                        case 'disabled':
                            entityVersions.disabled.push(version.version);
                            break;
                    }

                    // service ensures there is only one default version
                    if (version.defaultVersion)
                        entityVersions.default.push(version.version);
                });

                $("#view-summary").append(createAccordionWidgetDiv('enitity', entity, entityVersions));
            });
        });
    });
}

function createAccordionWidgetDiv(type, title, ddStructure) {
    "use strict";
    var divPanel = $('#accordion-widget-template div:first').clone();

    var id = type+'-'+title;

    $('div.panel-heading a', divPanel).attr('href', "#"+id).text(title);
    $('div.panel-collapse', divPanel).attr('id', id);
    $('div.panel-body', divPanel).empty();

    if(ddStructure instanceof Object) {
        $.each(ddStructure, function(section, subsections) {
            if (subsections instanceof Array) {
                var td = $('<dt>'+section+'</dt>');
                var dl = $('<dl>').append(td);

                $.each(subsections, function(i, subsection){
                    $('<dd>').text(subsection).appendTo(dl);
                });

                $("div.panel-body", divPanel).append(dl);
            }
        });
    }

    return divPanel;
}

// save button clicked
function onSave() {
    "use strict";
    switch (window.globalSubmitActionEvent.action) {
        case 'new':
            onCreateEntitySave();
            break;
        case 'edit':
            onEditEntitySave();
            break;
        case 'version':
            onCreateVersionSave();
            break;
        default:
            ;
    }
}

// Save clicked in Create Entity view
function onCreateEntitySave() {
    "use strict";
    try {
        var json = JSON.parse($("#json").val());

        var entityName = json.schema.name;
        var entityVersion = json.schema.version.value;

        callLightblue(entityName +'/' + entityVersion, json, 'PUT');
    }
    catch (e) {
        showError('Error parsing json: ' + e);
    }
}

// Save clicked in Create Version view
function onCreateVersionSave() {
    "use strict";
    try {
        var json = JSON.parse($("#json").val());

        var entityName = json.schema.name;
        var entityVersion = json.schema.version.value;

        callLightblue(entityName +'/schema=' + entityVersion, json.schema, 'PUT');
    }
    catch (e) {
        showError('Error parsing json: ' + e);
    }
}

// Save clicked in Edit Entity view
function onEditEntitySave() {
    "use strict";
    try {
        var json = JSON.parse($("#json").val());

        var entityName = json.entityInfo.name;

        callLightblue(entityName, json.entityInfo, 'PUT');
    }
    catch (e) {
        showError('Error parsing json: ' + e);
    }
}

function callLightblue(uri, jsonData, method) {
    "use strict";

    var request = $.ajax({
        type: method,
        url: metadataServicePath + uri,
          contentType: "application/json",
        data: JSON.stringify(jsonData)
    });

    request.done(function( msg ) {
        if (msg.objectType === 'error') {
            showLightblueErrorMessage(msg);
        }
        else {
              console.debug("Data Saved: "+JSON.stringify(msg));
              showSuccessMessage("Data Saved");
              loadEntities();
        }
    });

    request.fail(function( jqXHR, textStatus ) {
        showErrorMessage( textStatus );
    });
}

// Show a description of the action
function loadActionDescription(entity) {
    if (entity == null || entity == "") {
        return;
    }
    
    var desc = "";
    var gitbook = "http://jewzaam.gitbooks.io/lightblue-specifications/content"
    
    switch(entity) {
	    case "view":
	    	desc = "View all global <a target='_blank' href='" 
	    		+ gitbook 
	    		+ "/language_specification/metadata.html'>information</a> associated with the selected entity."; 
	        break;
	    case "edit":
	    	desc = "Edit the <a target='_blank' href='" 
	    		+ gitbook 
	    		+ "/rest_specification/put_update_entity_info.html'>information</a> of a specific entity."; 
	    	break;
	    case "new":
	    	desc = "Create a <a target='_blank' href='" 
	    		+ gitbook 
	    		+ "/rest_specification/put_create_new_metadata.html'>new entity</a> by defining new metadata.";
	    	break;
	    case "version":
	    	desc = "Create a new <a target='_blank' href='"
	    		+ gitbook 
	    		+ "/rest_specification/put_create_new_schema.html'>schema</a>, representing a new version of an existing entity.";
	    	break;
	    case "roles":
	    	desc = "View all <a target='_blank' href='" 
	    		+ gitbook 
	    		+ "/rest_specification/get_entity_roles.html'>roles</a> and the entities they allow access to.  If an entity is slected, view all roles for that entity. If a version is seleceted, view all roles for that entity at the specified version.";
	    	break;
	    case "summary":
	    	desc = "View an overall summary of the available entities, including their versions.";
	    	break;
    }
    $('#action-desc').html(desc);
}

function loadVersions() {
    "use strict";

    var request = $.ajax({
        type: "GET",
        url: metadataServicePath + "health",
          contentType: "application/json",
        dataType: "html"
    });

    request.done(function( msg ) {
        if (msg.objectType === 'error') {
            showLightblueErrorMessage(msg);
        }
        else {
            $("#metadata-service-version").text("Metadata Service Version: " + msg);
        }
    });

    request.fail(function( jqXHR, textStatus ) {
        showErrorMessage( textStatus );
    });
}

  function loadEntities() {
      "use strict";

      var entitySelect = $("#entities");
      $.getJSON( metadataServicePath, function( json ) {
          var entities = json.entities;
          entitySelect.empty();
          entitySelect.append("<option value='' disabled selected>Entity:</option>");
          $.each( entities, function(index, entity) {
              entitySelect.append("<option value='" + entity + "'>" + entity + "</option>");
          });
          loadEntityVersions(null);
      }).fail(function( jqxhr, textStatus, error ) {
          showErrorMessage(textStatus + " "+error);
      });
  }

  function loadEntityVersions(entity) {
      "use strict";

      var versionSelect = $("#versions");
      versionSelect.empty();
      versionSelect.append("<option value='' disabled selected>Version:</option>");

      if (entity == null || entity == "") {
          // just clear the selection dropdown
          return;
      }

      $.getJSON( metadataServicePath + entity, function( json ) {
          var versions = json;
          versions.sort(function(v1, v2) {
             return v1.version.localeCompare(v2.version);
          });
          $.each( versions, function( index, version ) {
              if(version.status == "active")
                  versionSelect.append("<option value='" + version.version + "'>" + version.version + "</option>");
          });
      }).fail(function( jqxhr, textStatus, error ) {
          showErrorMessage(textStatus + " "+error);
      });
  }

$(document).ready(function() {
    "use strict";

    if (!isAdmin()) {
        $(".role-user-admin").hide();
    }

    loadVersions();

    var entitySelect = $("#entities");
    var actionSelect = $("#actions");
    var versionSelect = $("#versions");
    var submitButton = $("#load-content-btn");

    var jsonTextArea = $("#json");
    var jsonTreeEditor = $("#editor");

    loadEntities();

    actionSelect.change(function() {
        loadActionDescription($(this).val());
    });
    
    entitySelect.change(function() {
          loadEntityVersions($(this).val());
    });

    submitButton.click(function() {

      var submitActionEvent = new Object();
      submitActionEvent.action = $("#actions").val();
      submitActionEvent.entity = entitySelect.val();
      submitActionEvent.version = versionSelect.val();
      submitActionEvent.isJsonEditorView = $.inArray(submitActionEvent.action, ['view', 'edit', 'new', 'version']) > -1;
      submitActionEvent.isEditable = $.inArray(submitActionEvent.action, ['edit', 'new', 'version']) > -1;

      // make it global
      window.globalSubmitActionEvent = submitActionEvent;

      // authorize
      if (!isAdmin()) {
          submitActionEvent.isEditable = false;
      }

      // validation
      if  ($.inArray(submitActionEvent.action, ['summary', 'new', 'version']) == -1) {
          var errors = validateActionSubmit(submitActionEvent, ['action', 'entity', 'version']);
          if (errors.length > 0) {
              alert(errors+" required!");
              return;
          }
      }

      onActionSubmit(submitActionEvent);

      if (submitActionEvent.isJsonEditorView) {
          $.getJSON( metadataServicePath + submitActionEvent.entity + "/" + submitActionEvent.version, function( json ) {
              jsonTextArea.val(JSON.stringify(json));
              jsonTreeEditor.jsonEditor(json, { change: updateJSON, propertyclick: showPath, isEditable: submitActionEvent.isEditable });

              onJsonEditorReady(submitActionEvent);
          });
      }
      else if (submitActionEvent.action == 'roles') {
          onViewRoles(submitActionEvent);
      }
      else if (submitActionEvent.action == 'summary') {
          onViewSummary(submitActionEvent);
      }

    });

    $("#saveButton").click(onSave);

    $("#resetButton").click(function(){
        // reload data in the editor
        // this is essentially the same thing as clicking on the submit button
        $("#load-content-btn").trigger('click');
    });

    $('#beautify').click(function(evt) {
        evt.preventDefault();
        var jsonText = $('#json').val();
        $('#json').val(JSON.stringify(JSON.parse(jsonText), null, 4));
    });

    $('#uglify').click(function(evt) {
        evt.preventDefault();
        var jsonText = $('#json').val();
        $('#json').val(JSON.stringify(JSON.parse(jsonText)));
    });

    showView();

});
