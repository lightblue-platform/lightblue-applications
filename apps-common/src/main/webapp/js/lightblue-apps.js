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
        submitActionEvent.isJsonEditorView = $.inArray(submitActionEvent.action, ['view', 'edit', 'new', 'version']) > -1;
        submitActionEvent.isEditable = submitActionEvent.action != 'view';

        onActionSubmit(submitActionEvent);

        if (submitActionEvent.isJsonEditorView) {
            $.getJSON( metadataServicePath + entitySelect.val() + "/" + versionSelect.val(), function( json ) {
                jsonTextArea.val(JSON.stringify(json));
                jsonTreeEditor.jsonEditor(json, { change: updateJSON, propertyclick: showPath, isEditable: submitActionEvent.isEditable });

                onJsonEditorReady(submitActionEvent);
            });
        }

      });

      showView();
           
  });
