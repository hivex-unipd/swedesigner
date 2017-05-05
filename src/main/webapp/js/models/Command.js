define([
    'jquery',
    'underscore',
    'backbone',
    'models/ProjectModel',
], function ($, _, Backbone, ProjectModel) {

    /**
     * @classdesc `Commands` exposes methods which represent the main
     * actions that a user can perform in the application.
     *
     * @module client.models
     * @name Commands
     * @class Commands
     */
    var Commands = {

        /**
         * Asks the `ProjectModel` object to save the whole project
         * to a JSON file; then gives the file to the user.
         * @name Commands#saveDiagram
         * @function
         */
        saveProject: function () {
            var blob = new Blob([ProjectModel.saveProject()], {type: "application/json"});
            var url = window.URL.createObjectURL(blob);

            //hacky things
            var a = document.createElement('a');
            a.style = "display:none";
            a.download = "project.json";
            a.href = url;
            a.textContent = "Download backup.json";
            $('details').append(a);
            a.click();
            $('details').remove(a);
        },

        /**
         * Asks the `ProjectModel` object to load an entire project
         * from a JSON file uploaded by the user.
         * @name Commands#loadDiagram
         * @function
         * @param {event} evt the action event
         */
        loadProject: function (evt) {
            var files = evt.target.files; // FileList object
            f = files[0];
            var reader = new FileReader();

            // Closure to capture the file information.
            reader.onload = function (e) {
                // Render thumbnail.
                JsonObj = e.target.result;
                //console.log(JsonObj);
                ProjectModel.loadProject(JsonObj);
            };
            reader.readAsText(f);
        },

        newProject: function(evt){
            ProjectModel.newProject();
        },


        sendDiagram: function () {
            var data = {};


            // construct an HTTP request
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/generate", true);
            xhr.responseType = "arraybuffer";
            xhr.setRequestHeader('Content-Type', 'application/json');
            // send the collected data as JSON
            xhr.send(ProjectModel.saveProject());           
            xhr.onload = function () {
            	// Create a new Blob object using the 
                //response data of the onload object
            	if(this.status==200){
					var data = (this.response);
					var blob = new Blob([data],{type: "application/octet-stream"});
					//Create a link element, hide it, direct 
					//it towards the blob, and then 'click' it programatically
					let a = document.createElement("a");
					a.style = "display: none";
					document.body.appendChild(a);
					//Create a DOMString representing the blob 
					//and point the link element towards it
					let url = window.URL.createObjectURL(blob);
					a.href = url;
					a.download = 'projectzip.zip';
					//programatically click the link to trigger the download
					a.click();
					window.URL.revokeObjectURL(url);
            	}
            	else{
            		function arrayBufferToString(buffer){
            		    var arr = new Uint8Array(buffer);
            		    var str = String.fromCharCode.apply(String, arr);
            		    if(/[\u0080-\uffff]/.test(str)){
            		        throw new Error("this string seems to contain (still encoded) multibytes");
            		    }
            		    return str;
            		}           		
            		alert(arrayBufferToString(this.response));
            	}            
            };

        },
    };

    /**
     * Executes the `Commands` method whose name matches `name`.
     * @name Commands#execute
     * @function
     * @param {string} name the command to be executed
     */
    Commands.execute = function (name) {
        return Commands[name] && Commands[name].apply(Commands, [].slice.call(arguments, 1));
    };

    return Commands;
});
