  function onActionSubmit(event) {
      showView(event);

      switch (event.action) {
          case 'view':
              $("#removeItemHowToMessage").hide();
              break;
          default:
              $("#removeItemHowToMessage").show();
      }
  }

  function onJsonEditorReady(event) {
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
      $("div.view-div").hide();
      if (typeof event !== "undefined") {
          if (event.isJsonEditorView)
              $("#view-jsonEditor").show();
          else
              $("#view-"+event.action).show();
      }
  }

  function onViewRoles(event) {
      $.getJSON( metadataServicePath + event.entity + "/" + event.version + "/roles", function( json ) {
          var roles = json.processed;

          $("#view-roles").empty();
          $.each(roles, function(i, role) {
              $("#view-roles").append(createAccordionWidgetDiv('role', role.role, role));
          });
      });
  }

  function onViewSummary(event) {
      // TODO
      /*$.getJSON( metadataServicePath, function( entities ) {
          $.each(entities, function(i, entity) {
              $("#view-summary").append(createAccordionWidgetDiv('enitity', entity));
          });
      });*/
  }

  function createAccordionWidgetDiv(type, title, ddStructure) {
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

  function createRoleDiv(role) {
      var divPanel = $('#accordion-widget-template div:first').clone();

      var id = 'role-'+role.role;

      $('div.panel-heading a', divPanel).attr('href', "#"+id).text(role.role);
      $('div.panel-collapse', divPanel).attr('id', id);
      $('div.panel-body', divPanel).empty();

      $.each(role, function(key, paths) {
          if (key != 'role') {
              var td = $('<dt>'+key+'</dt>');
              var dl = $('<dl>').append(td);

              $.each(paths, function(i, path){
                  $('<dd>').text(path).appendTo(dl);
              });

              $("div.panel-body", divPanel).append(dl);
          }
      });

      return divPanel;
  }

  $(document).ready(function() {

      var entitySelect = $("#entities");
      var versionSelect = $("#versions");
      var submitButton = $("#load-content-btn");

      var jsonTextArea = $("#json");
      var jsonTreeEditor = $("#editor");

      $.getJSON( metadataServicePath, function( json ) {
          $.each( json, function( key, val ) {
              $.each( val, function( arrayVal ) {
                  entitySelect.append("<option value='" + val[arrayVal] + "'>" + val[arrayVal] + "</option>");
              });
          });
       });

      entitySelect.change(function() {
          versionSelect.empty();
          versionSelect.append("<option value='' disabled selected>Version:</option>");
          $.getJSON( metadataServicePath + entitySelect.val(), function( json ) {
              $.each( json, function( versions, details ) {
                  $.each(details, function( arrayIndex ) {
                       $.each(details[arrayIndex], function(attributeName, value) {
                            if(attributeName == "value") {
                               versionSelect.append("<option value='" + value + "'>" + value + "</option>");
                            }
                       });
                  });         
              });
           });
      });

      submitButton.click(function() {

        var submitActionEvent = new Object();
        submitActionEvent.action = $("#actions").val();
        submitActionEvent.entity = entitySelect.val();
        submitActionEvent.version = versionSelect.val();
        submitActionEvent.isJsonEditorView = $.inArray(submitActionEvent.action, ['view', 'edit', 'new', 'version']) > -1;
        submitActionEvent.isEditable = submitActionEvent.action != 'view';

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

      showView();
           
  });
