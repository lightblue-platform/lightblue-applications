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
        $.getJSON( metadataServicePath + entitySelect.val() + "/" + versionSelect.val(), function( json ) {
        	jsonTextArea.val(JSON.stringify(json));
        	jsonTreeEditor.jsonEditor(json, { change: updateJSON, propertyclick: showPath });
        });
      });
           
  });